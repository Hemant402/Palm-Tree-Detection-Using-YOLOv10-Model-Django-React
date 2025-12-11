from rest_framework import generics, permissions
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .auth import CsrfExemptSessionAuthentication
from django.contrib.auth import authenticate, login, logout

from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]



@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([permissions.AllowAny])
def login_view(request):
    print("RAW REQUEST DATA:", request.data)

    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()
    remember = request.data.get('remember', False)   # <-- get remember flag from React

    print("USERNAME:", username)
    print("PASSWORD:", password)
    print("REMEMBER:", remember)

    # Allow login using email
    if "@" in username:
        try:
            user_obj = User.objects.get(email=username)
            username = user_obj.username
        except User.DoesNotExist:
            print("EMAIL NOT FOUND")
            return Response({'error': 'Invalid credentials'}, status=400)

    # Authenticate user
    user = authenticate(username=username, password=password)

    if user:
        print("AUTH SUCCESS:", user)
        login(request, user)

        # -----------------------------------------
        # REMEMBER ME FEATURE
        # -----------------------------------------
        if remember:
            request.session.set_expiry(60 * 60 * 24 * 7)  # keep session 7 days
            print("SESSION EXPIRY: 7 DAYS")
        else:
            request.session.set_expiry(0)  # expire when browser closes
            print("SESSION EXPIRY: UNTIL BROWSER CLOSE")
        # -----------------------------------------

        return Response({
            'id': user.id,
            'username': user.username,
            'email' : user.email,
            "is_staff": bool(user.is_staff),
            "is_superuser": bool(user.is_superuser),
        })

    print("AUTH FAILED")
    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    logout(request)
    return Response({'success': 'Logged out'})

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([permissions.AllowAny])
def create_staff(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
            email=serializer.validated_data.get("email", ""),
            password=request.data.get("password"),
            is_staff=True
        )
        return Response(UserSerializer(user).data, status=201)

    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    data = request.data

    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    # Only update password if provided
    if data.get("password"):
        if data.get("password") != data.get("confirm_password"):
            return Response({"error": "Passwords do not match"}, status=400)
        user.set_password(data.get("password"))

    user.save()

    return Response({"message": "User updated successfully"})


@api_view(["DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([permissions.AllowAny])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Prevent deleting superuser
    if user.is_superuser:
        return Response({"error": "Cannot delete superuser"}, status=403)

    user.delete()
    return Response({"message": "User deleted"})

@api_view(['GET'])
def dashboard_user(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        })
    return Response({"error": "Not authenticated"}, status=401)



