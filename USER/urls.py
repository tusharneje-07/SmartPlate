from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('', views.user_dashboard, name="Welcome Endpoint"),
    path('search/', views.seach_mess, name="search/"),
    path('vendor/<str:mess_id>/', views.select_menu, name="vendor"),
    path('vendor/<str:mess_id>/cart', views.go_to_cart, name="cart"),
    path('vendor/<str:mess_id>/payment', views.process_payment, name="payment"),
    path('api-get-nearby-mess/', views.show_nearby_mess, name="api-get-nearby-mess/"),
    path('api-payment/<str:mess_id>/<int:payment_amount>', views.payment_api, name="api-payment/"),
    path('api-get-payment-data', views.get_current_payment, name="api-get-payment-data/"),
]
