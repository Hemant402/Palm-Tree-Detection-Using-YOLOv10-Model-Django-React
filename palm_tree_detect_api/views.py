from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import FileSystemStorage
from .models import PalmImage, DashboardDesign, MenuDesign, PalmInfo, AboutUsInfo
import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas
from django.conf import settings
from django.db import connection
from .serializers import DashboardDesignSerializer
from django.db.models import Count
from django.db.models.functions import TruncDate
from .detect import run_detection
from django.forms.models import model_to_dict
# Create your views here.
def home(request):
    return HttpResponse("hello world!")

@csrf_exempt
def uploadPalmImage(request):
    if request.method == "POST":

        # Get admin ID
        admin_id = request.POST.get("admin_id")

        # Get multiple images
        images = request.FILES.getlist("images")

        if not images:
            return JsonResponse({"error": "No images uploaded"}, status=400)

        fs = FileSystemStorage()

        uploaded_images = []

        # Process each image
        for img in images:
            filename = fs.save(img.name, img)
            file_url = fs.url(filename)

            # Insert into database
            with connection.cursor() as cursor:
                query = """
                    INSERT INTO palm_images (admin_id, filename, date_processed, palm_count)
                    VALUES (%s, %s, NOW(), 0)
                    RETURNING image_id;
                """
                cursor.execute(query, [admin_id, filename])
                image_id = cursor.fetchone()[0]

            uploaded_images.append({
                "image_id": image_id,
                "filename": filename,
                "file_url": file_url
            })

        return JsonResponse({
            "success": True,
            "uploaded": uploaded_images
        })

    return JsonResponse({"error": "Invalid request"}, status=400)



def detect_palms(request):
    if request.method == "POST":
        result = run_detection()
        return JsonResponse(result)

@api_view(['GET'])
def detect_palms(request):
    result = run_detection()
    return Response(result)

def getPalmImages(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET only"}, status=405)

    images = PalmImage.objects.all().order_by("-image_id")

    data = [
        {
            "image_id": img.image_id,
            "filename": img.filename,
            "image_url": f"http://localhost:8000/media/{img.filename}",
            "date_processed": img.date_processed.strftime("%Y-%m-%d") if img.date_processed else None,
            "palm_count": img.palm_count,
        }
        for img in images
    ]

    return JsonResponse(data, safe=False)

@csrf_exempt
def deletePalmImage(request, image_id):
    try:
        img = PalmImage.objects.get(image_id=image_id)

        # Construct the absolute file path
        file_path = os.path.join(settings.MEDIA_ROOT, img.filename)

        # Delete the file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete database row
        img.delete()

        return JsonResponse({"success": True, "message": "Image deleted successfully"})

    except PalmImage.DoesNotExist:
        return JsonResponse({"error": "Image not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def getDetections(request):
    data = list(PalmInfo.objects.all().values(
        "image_id",
        "admin_id",
        "palm_id",
        "x_min",
        "y_min",
        "x_max",
        "y_max",
        "confidence",
        "date_processed"
    ))
    return JsonResponse(data, safe=False)

def downloadReportPDF(request):
    # Prepare response
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=palm_report.pdf"

    # PDF Document
    doc = SimpleDocTemplate(
        response,
        pagesize=letter,
        rightMargin=30,
        leftMargin=30,
        topMargin=40,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()
    normal = styles["Normal"]
    title = styles["Title"]

    elements = []

    # Title
    elements.append(Paragraph("Palm Detection Report", title))
    elements.append(Spacer(1, 12))

    detections = PalmInfo.objects.all()

    if not detections.exists():
        elements.append(Paragraph("No detection records found.", normal))
    else:
        for det in detections:
            text = f"""
            <b>Image:</b> {det.image_id}<br/>
            <b>Admin:</b> {det.admin_id}<br/>
            <b>Palm ID:</b> {det.palm_id}<br/>
            <b>Coordinates:</b> ({det.x_min}, {det.y_min}) → ({det.x_max}, {det.y_max})<br/>
            <b>Confidence:</b> {det.confidence}<br/>
            <b>Date:</b> {det.date_processed.strftime('%Y-%m-%d')}<br/>
            <br/>
            """
            elements.append(Paragraph(text, normal))
            elements.append(Spacer(1, 6))

    # Build PDF
    doc.build(elements)

    return response

@api_view(['GET'])
def get_dashboard_design(request):
    settings = DashboardDesign.objects.get(pk=1)
    serializer = DashboardDesignSerializer(settings)
    return Response(serializer.data)

@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def update_dashboard_design(request):
    settings = DashboardDesign.objects.get(pk=1)
    serializer = DashboardDesignSerializer(settings, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Dashboard design updated successfully"})
    
    return Response(serializer.errors, status=400)

@csrf_exempt
def get_menus(request):
     menus = MenuDesign.objects.all()
     menu_list = []

     for m in menus:
            menu_list.append({
                "id": m.id,
                "menu_name": m.menu_name,
                "menu_icon": m.menu_icon.url if m.menu_icon else None,  # FIXED
                "menu_link": m.menu_link,
                "menu_created_at": m.menu_created_at,
            })

     return JsonResponse(menu_list, safe=False)

@csrf_exempt
def add_menu(request):
    if request.method == "POST":
        menu_name = request.POST.get("menu_name")
        menu_link = request.POST.get("menu_link")
        menu_icon = request.FILES.get("menu_icon")

        menu = MenuDesign.objects.create(
            menu_name=menu_name,
            menu_link=menu_link,
            menu_icon=menu_icon
        )

        return JsonResponse({"message": "Menu created", "id": menu.id})
    
@csrf_exempt
def update_menu(request, menu_id):
    if request.method == "PUT" or request.method == "POST":
        menu = MenuDesign.objects.get(id=menu_id)

        menu.menu_name = request.POST.get("menu_name", menu.menu_name)
        menu.menu_link = request.POST.get("menu_link", menu.menu_link)

        if "menu_icon" in request.FILES:
            menu.menu_icon = request.FILES["menu_icon"]

        menu.save()
        return JsonResponse({"message": "Menu updated"})


@csrf_exempt
def delete_menu(request, menu_id):
    if request.method == "DELETE":
        try:
            menu = MenuDesign.objects.get(id=menu_id)
            menu.delete()
            return JsonResponse({"message": "Menu deleted"})
        except MenuDesign.DoesNotExist:
            return JsonResponse({"error": "Menu not found"}, status=404)


def report_stats(request):
    total_images = PalmInfo.objects.values("image_id").distinct().count()
    total_palms = PalmInfo.objects.count()

    daily = (
        PalmInfo.objects
        .annotate(date=TruncDate("date_processed"))
        .values("date")
        .annotate(palms=Count("palm_id"))
        .order_by("date")
    )

    per_image = (
        PalmInfo.objects.values("image_id")
        .annotate(palm_count=Count("palm_id"))
        .order_by("image_id")
    )

    low = PalmInfo.objects.filter(confidence__lt=0.5).count()
    medium = PalmInfo.objects.filter(confidence__gte=0.5, confidence__lt=0.8).count()
    high = PalmInfo.objects.filter(confidence__gte=0.8).count()

    return JsonResponse({
        "total_images": total_images,
        "total_palms": total_palms,
        "daily_stats": list(daily),
        "per_image_stats": list(per_image),
        "confidence_distribution": {
            "low": low,
            "medium": medium,
            "high": high
        }
    })

def get_about_us(request):
    data = []

    for item in AboutUsInfo.objects.all().order_by("-card_id"):
        data.append({
            "card_id": item.card_id,
            "name": item.name,
            "position": item.position,
            "interested_at":item.interested_at,
            "description": item.description,
            "profile_pic": item.profile_pic.url if item.profile_pic else None,
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
def add_about_us(request):
    if request.method == "POST":
        name = request.POST.get("name")
        position = request.POST.get("position")
        interested_at = request.POST.get("interested_at")
        description = request.POST.get("description")
        profile_pic = request.FILES.get("profile_pic")

        item = AboutUsInfo.objects.create(
            name=name,
            position=position,
            interested_at=interested_at,
            description=description,
            profile_pic=profile_pic
        )

        return JsonResponse({"message": "Added Successfully", "id": item.card_id})
    
@csrf_exempt
def update_about_us(request, card_id):
    try:
        about = AboutUsInfo.objects.get(card_id=card_id)
    except AboutUsInfo.DoesNotExist:
        return JsonResponse({"error": "Card not found"}, status=404)

    if request.method == "POST":
        name = request.POST.get("name")
        position = request.POST.get("position")
        interested_at = request.POST.get("interested_at")
        description = request.POST.get("description")
        profile_pic = request.FILES.get("profile_pic")

        about.name = name
        about.position = position
        about.interested_at = interested_at
        about.description = description

        if profile_pic:
            if about.profile_pic:
                if os.path.exists(about.profile_pic.path):
                    os.remove(about.profile_pic.path)

            about.profile_pic = profile_pic

        about.save()

        return JsonResponse({"message": "Updated Successfully"})
    
@csrf_exempt
def delete_about_us(request, card_id):
    try:
        about = AboutUsInfo.objects.get(card_id=card_id)
    except AboutUsInfo.DoesNotExist:
        return JsonResponse({"error": "Card not found"}, status=404)

    if about.profile_pic and os.path.exists(about.profile_pic.path):
        os.remove(about.profile_pic.path)

    about.delete()
    return JsonResponse({"message": "Deleted Successfully"})




