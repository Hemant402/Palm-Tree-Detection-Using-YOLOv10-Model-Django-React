from django.urls import path
from .views import RegisterView, login_view, logout_view, user_list, dashboard_user, create_staff, update_user, delete_user

urlpatterns = [
    
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('dashboard/user/', dashboard_user, name='dashboard_user'),
    path('create-staff/', create_staff, name="create-staff"),
    path('update/<int:user_id>/', update_user, name="update-user"),
    path('delete/<int:user_id>/', delete_user, name="delete-user"),
    path('', user_list, name='user-list'),
]
