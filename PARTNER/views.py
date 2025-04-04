
from datetime import date
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import MessInfo, PartnerInfo, OrderInformation
from django.db.models import Sum
from datetime import datetime

@login_required
def prt_dashboard(request,id):
    print("ID is ------------------------- ",id)
    parms = {
        'id':id
    }
    return render(request, 'PARTNER/PRT_dashboard.html',parms)

def update_crowd_count(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    mess_info.crowd_status = request.GET.get('crowd_status')
    mess_info.save()
    print("Crowd Status Updated to ------------------------- ",mess_info.crowd_status)
    return JsonResponse({"message":"Crowd Status Updated Successfully"})

def get_crowd_count_data(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    return JsonResponse({"crowd_status":mess_info.crowd_status})

def get_order_time_distribution(request, id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    
    # Define time ranges
    time_ranges = [
        ('08:00', '10:00'),
        ('10:00', '11:00'),
        ('11:00', '12:00'),
        ('12:00', '13:00'),
        ('13:00', '14:00'),
        ('14:00', '15:00'),
        ('15:00', '16:00'),
        ('16:00', '17:00'),
        ('17:00', '18:00'),
        ('18:00', '19:00'),
        ('19:00', '20:00'),
        ('20:00', '21:00'),
        ('21:00', '22:00'),
        ('22:00', '23:00'),
        ('23:00', '00:00')
    ]
    
    labels = []
    values = []
    
    for start_time, end_time in time_ranges:
        # Format label
        label = f"{start_time}-{end_time}"
        labels.append(label)
        
        # Count orders in this time range
        count = OrderInformation.objects.filter(
            mess_id=mess_info.mess_id,
            time__gte=start_time,
            time__lt=end_time,
            date=date.today()
        ).count()
        
        values.append(count)
    
    return JsonResponse({
        'labels': labels,
        'values': values
    })

def api_get_dashboard_data(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    total_orders = OrderInformation.objects.filter(mess_id=mess_info.mess_id, date=date.today()).count()
    
    total_quantity = OrderInformation.objects.filter(mess_id=mess_info.mess_id, date=date.today()).values()
    quantity = 0
    for i in total_quantity:
        quantity += len(i.get('order_details'))
        
    total_quantity_hour = OrderInformation.objects.filter(mess_id=mess_info.mess_id, date=date.today(), time__hour=datetime.now().hour).values()
    quantity_hour = 0
    for i in total_quantity_hour:
        quantity_hour += len(i.get('order_details'))
    
    total_rating = MessInfo.objects.filter(mess_id=mess_info.mess_id).first().mess_rating
    
    return JsonResponse({"mess_info":mess_info.mess_id, "total_orders":total_orders, "total_quantity":quantity, "total_quantity_hour":quantity_hour, "total_rating":total_rating})