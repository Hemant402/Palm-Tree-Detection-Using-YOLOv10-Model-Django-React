from django.db import models
from django.contrib.auth.models import User  # only if using built-in admin

class PalmImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    filename = models.CharField(max_length=255)
    date_processed = models.DateTimeField(auto_now_add=True)
    palm_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'palm_images'


    def __str__(self):
        return self.filename
    

class PalmInfo(models.Model):
    palm_id = models.AutoField(primary_key=True)  

    # Relationship to the existing palm_images table
    image = models.ForeignKey(
        PalmImage,
        on_delete=models.CASCADE,
        related_name='detections'   # You can now call palm_image_instance.detections.all()
    )

    admin = models.ForeignKey(User, on_delete=models.CASCADE)

    # Bounding box columns
    x_min = models.FloatField()
    y_min = models.FloatField()
    x_max = models.FloatField()
    y_max = models.FloatField()
    confidence = models.FloatField()

    date_processed = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'palm_info'

    def __str__(self):
        return f"{self.filename} - Palm {self.palm_id}"
    
class DashboardDesign(models.Model):
    title = models.CharField(max_length=200, default="Palm Tree Detection System")
    logo = models.ImageField(upload_to="images/", blank=True, null=True)
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        pass
    
    class Meta:
        db_table = 'dashboard_design'

    def __str__(self):
        return "Dashboard Design"
    
from django.db import models

class MenuDesign(models.Model):
    menu_name = models.CharField(max_length=100)
    menu_icon = models.ImageField(upload_to="menu_icons/", blank=True, null=True)
    menu_link = models.CharField(max_length=200, blank=True, null=True)
    menu_created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'menu_design'

    def __str__(self):
        return self.menu_name

class AboutUsInfo(models.Model):
    card_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    profile_pic = models.ImageField(upload_to="aboutus/", blank=True, null=True)
    position = models.CharField(max_length=200)
    interested_at = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField()

    class Meta:
        db_table = 'aboutus_info'

    def __str__(self):
        return self.name

# Create your models here.
