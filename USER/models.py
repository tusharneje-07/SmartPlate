from django.db import models
from django.contrib import admin

class UserAuth(models.Model):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=[
        ('#00', 'User'),
        ('#01', 'Mess Owner'),
        ('#02', 'Admin')
    ]) 

    def __str__(self):
        return self.username

admin.site.register(UserAuth)