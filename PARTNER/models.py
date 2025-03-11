from django.db import models
from django.contrib import admin
from django.templatetags.static import static

class MessInfo(models.Model):
    mess_id = models.CharField(max_length=50, unique=True)
    imgs = models.IntegerField()
    open_time = models.CharField(max_length=100)
    mess_name = models.CharField(max_length=100)
    mess_address = models.TextField()
    crowd_status = models.IntegerField(default=-1)
    mess_rating = models.FloatField()
    geo_lat = models.FloatField()
    geo_lng = models.FloatField()
    keywords = models.JSONField()

    def __str__(self):
        return f"{self.mess_id} => {self.mess_name}"

    def get_image_url(self):
        static_path = static(f'imgs/{self.mess_id}/{self.mess_id}.webp')
        return static_path

class MenuInfo(models.Model):
    mess = models.ForeignKey(MessInfo, on_delete=models.CASCADE, to_field='mess_id', db_column='mess_id')
    date = models.DateField()
    menu = models.JSONField()

    def __str__(self):
        return f"Menu for {self.mess.mess_name} on {self.date}"
    
    def get_image_url(self,imgpath):
        static_path = static(f'imgs/{imgpath}')
        return static_path

admin.site.register(MessInfo)
admin.site.register(MenuInfo)


