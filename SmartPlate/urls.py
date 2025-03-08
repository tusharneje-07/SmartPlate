"""
URL configuration for SmartPlate project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('welcome/', views.welcome, name="Welcome Endpoint"),
    path('user/',include('USER.urls'), name="USER_ENTRY_POINT"),
    path('',views.auth_pass, name="auth_pass"),
    path('google-login/', views.google_login, name='google-login'),
    path('oauth/', include('social_django.urls', namespace='social')), 
    path('user_logout/', views.user_logout, name="Logout"), 
    
    
    # GLOBAL ENTRY POINTS
    path('user_login/', views.user_login, name="user_login"),
    path('check_db/', views.check_db, name="check_db"),
    
]
