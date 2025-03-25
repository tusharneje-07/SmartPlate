from django.urls import path
from . import views

urlpatterns = [
    path('<str:id>', views.prt_dashboard, name='prt_dashboard'),
] 