from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('', views.user_dashboard, name="Welcome Endpoint"),
    path('search/', views.seach_mess, name="search/"),
    path('vendor/<str:mess_id>/', views.select_menu, name="vendor"),
    path('vendor/<str:mess_id>/cart', views.go_to_cart, name="cart"),
    path('api-get-nearby-mess/', views.show_nearby_mess, name="search/"),
]
