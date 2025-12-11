import glob
import os
import cv2
from ultralytics import YOLO
from .models import PalmImage, PalmInfo

def run_detection():
    media_root = "media"
    input_folder = media_root
    output_folder = os.path.join(media_root, "detected")

    os.makedirs(output_folder, exist_ok=True)

    image_paths = glob.glob(os.path.join(input_folder, "*.jpg")) + \
                  glob.glob(os.path.join(input_folder, "*.jpeg")) + \
                  glob.glob(os.path.join(input_folder, "*.png"))

    if not image_paths:
        return {"status": "error", "data": []}

    model_path = os.path.join(os.getcwd(), "yolo_models", "best.pt")
    model = YOLO(model_path)

    results = model(image_paths)

    response_data = []  # <-- RETURN DATA FOR REACT

    for r, img_path in zip(results, image_paths):

        filename = os.path.basename(img_path)

        # Save annotated image
        plotted_img = r.plot()
        detected_path = os.path.join("detected", filename)
        output_path = os.path.join(output_folder, filename)
        cv2.imwrite(output_path, plotted_img)

        # Lookup original image in DB
        try:
            img_obj = PalmImage.objects.get(filename=filename)
        except PalmImage.DoesNotExist:
            continue

        # Clear old detections
        PalmInfo.objects.filter(image=img_obj).delete()

        # Save detections
        palm_count = 0
        for box in r.boxes:
            x_min, y_min, x_max, y_max = box.xyxy[0].tolist()
            conf = float(box.conf[0])

            PalmInfo.objects.create(
                image=img_obj,
                admin=img_obj.admin,
                x_min=x_min,
                y_min=y_min,
                x_max=x_max,
                y_max=y_max,
                confidence=conf
            )

            palm_count += 1

        # Update count
        img_obj.palm_count = palm_count
        img_obj.save()

        # ----------- DATA FOR REACT TABLE -----------
        response_data.append({
            "original": filename,
            "detected": detected_path,
            "palm_count": palm_count
        })

    return {
        "status": "success",
        "data": response_data
    }

