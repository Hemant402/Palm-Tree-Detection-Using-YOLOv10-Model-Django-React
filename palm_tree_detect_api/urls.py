from django.urls import path
from .views import uploadPalmImage
from .views import detect_palms
from . import views


urlpatterns = [
    path("uploadPalmImage/", uploadPalmImage),
    path("getPalmImages/", views.getPalmImages, name="getPalmImages"),
    path("deletePalmImage/<int:image_id>/", views.deletePalmImage),
    path("detect-palms/", detect_palms, name="detect_palms"),
    path("getDetections/", views.getDetections),
    path("downloadReportPDF/", views.downloadReportPDF),
    path('dashboard-design/', views.get_dashboard_design),
    path('dashboard-design/update/', views.update_dashboard_design),
    path("menus/", views.get_menus),
    path("menus/add/", views.add_menu),
    path("menus/update/<int:menu_id>/", views.update_menu),
    path("menus/delete/<int:menu_id>/", views.delete_menu),
    path("report-stats/", views.report_stats),
    path("about-us/", views.get_about_us),
    path("about-us/add/", views.add_about_us),
    path("about-us/update/<int:card_id>/", views.update_about_us),
    path("about-us/delete/<int:card_id>/", views.delete_about_us),

]
