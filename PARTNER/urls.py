from django.urls import path
from . import views

urlpatterns = [
    path('<str:id>', views.prt_dashboard, name='prt_dashboard'),
    path('<str:id>/update_crowd_count_data/', views.update_crowd_count, name='update_crowd_count_data'),
    path('<str:id>/get_crowd_count_data/', views.get_crowd_count_data, name='get_crowd_count_data'),
    path('<str:id>/get_order_time_distribution/', views.get_order_time_distribution, name='get_order_time_distribution'),
    path('<str:id>/api-get-dashboard-data/', views.api_get_dashboard_data, name='api_get_dashboard_data'),
    
    
    # Accept Order
    path('<str:id>/accept_order/', views.accept_order, name='accept_order'),
    path('<str:id>/get_accept_order_data/', views.get_accept_order_data, name='get_accept_order_data'),
    path('<str:id>/update_order_status/', views.update_order_status, name='update_order_status'),
    path('<str:id>/update_order_accepting/', views.update_order_accepting, name='update_order_accepting'),
    path('<str:id>/get_accept_status/', views.get_accept_status, name='get_accept_status'),
    
    # Transaction
    path('<str:id>/transaction/', views.transaction, name='transaction'),
] 