
from datetime import date, timedelta
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import MessInfo, PartnerInfo, OrderInformation, MenuInfo
from django.db.models import Sum
from datetime import datetime
from .predict import get_chatbot_response, aggregate_orders
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


def accept_order(request,id):
    return render(request, 'PARTNER/PRT_acceptorder.html',{'id':id})

def transaction(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    print("Mess User is ------------------------- ",mess_user.mess_id)
    return render(request, 'PARTNER/PRT_transaction.html',{'id':id, 'uid':mess_user.mess_id, 'mess_name':mess_info.mess_name})

def get_accept_order_data(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    orders = OrderInformation.objects.filter(mess_id=mess_info.mess_id, date=date.today(), order_status=0).values()
    if orders:
        order_set = []
        for i in orders:
            order_detail_str = []
            for j in i.get('order_details'):
                order_detail_str_cap = str(j.get('quantity')) + " x " + str(j.get('name'))
                order_detail_str.append(order_detail_str_cap)
            order_set.append({
                "table":i.get('order_id'),
                "time_ago":i.get('time'),
                "orderId":i.get('id'),
                "customer":i.get('ordered_by_name'),
                "items":order_detail_str,
                "mess_id":i.get('mess_id')
            })
        return JsonResponse({"orders":order_set})
    else:
        return JsonResponse({"orders":[]})

def update_order_status(request,id):
    order_id = request.GET.get('order_id')
    mess_id = request.GET.get('mess_id')
    order = OrderInformation.objects.filter(mess_id=mess_id, order_id=order_id).first()
    order.order_status = 1
    order.save()
    print("Order Status is ------------------------- ",order.order_status)
    return JsonResponse({"message":"Order Status Updated Successfully"})

def update_order_accepting(request,id):
    is_accepting = request.GET.get('is_accepting')
    if is_accepting == "true":
        is_accepting = True
    else:
        is_accepting = False
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    mess_info.is_accepting = is_accepting
    mess_info.save()
    print("Is Accepting is ------------------------- ",is_accepting)
    return JsonResponse({"message":"Order Accepting Status Updated Successfully"})

def get_accept_status(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    print("Is NEW NEW  Accepting is ------------------------- ",mess_info.is_accepting)
    return JsonResponse({"is_accepting":mess_info.is_accepting})

def get_all_transaction(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    transaction = OrderInformation.objects.filter(mess_id=mess_user.mess_id).values()
    send_data = []
    for i in transaction:
        each_transaction = {}
        each_transaction['id'] = i['id']
        each_transaction['order_id'] = i['order_id']
        each_transaction['date'] = i['date']
        each_transaction['time'] = i['time']
        each_transaction['ordered_by_name'] = i['ordered_by_name']
        
        order_data = i['order_details']
        order_detail_str = ""
        total_price = 0
        for item in order_data:
            order_detail_str += f"{item['name']} ({item['quantity']}) - {', '.join(item['details'])} & "
            total_price += item['price']
        order_detail_str = order_detail_str.rstrip(' & ') 
        each_transaction['order_details'] = order_detail_str
        each_transaction['total_price'] = total_price

        if i['order_status'] == "-1":
            each_transaction['status'] = "Pending"
        elif i['order_status'] == "0":
            each_transaction['status'] = "Confirmed"
        elif i['order_status'] == "1":
            each_transaction['status'] = "Delivered"
        else:
            each_transaction['status'] = "Cancelled"

        
        send_data.append(each_transaction)
    
    return JsonResponse({"transaction":send_data})


def ai_report(request,id):
    return render(request, 'PARTNER/PRT_aireport.html',{'id':id})

def fetch_ai_report_data(request,id):
    mess_user = PartnerInfo.objects.filter(username=id).first()
    mess_info = MessInfo.objects.filter(mess_id=mess_user.mess_id).first()
    
    # Customer Visits -----------------------------------------------------------------------------
    last_7_days = [date.today() - timedelta(days=i) for i in range(7)]
    customer_data = []
    menu_data = []
    transaction_information = []
    plates_per_day = []
    orders = []  # New array for orders without rating and comment
    dish_counts = {}  # Dictionary to store counts of popular dishes
    
    for day in last_7_days:
        day_name = day.strftime('%A')
        
        count = OrderInformation.objects.filter(
            mess_id=mess_info.mess_id,
            date=day
        )
        plate_count = 0
        if count:
            for order in count:
                total_price = 0
                order_detail_str = ""
                for item in order.order_details:
                    order_detail_str += f"{item['name']} ({item['quantity']}) - {', '.join(item['details'])} & "
                    total_price += item['price']
                    plate_count += item['quantity']
                    
                    # Count occurrences of each dish
                    dish_name = item['name'].strip().lower()  # Normalize dish names
                    if dish_name not in dish_counts:
                        dish_counts[dish_name] = 0
                    dish_counts[dish_name] += item['quantity']
                
                transaction = {
                    'id': order.id,
                    'order_id': order.order_id,
                    'date': order.date.strftime('%Y-%m-%d'),
                    'time': order.time.strftime('%H:%M:%S'),
                    'ordered_by_name': order.ordered_by_name,
                    'order_details': order_detail_str,
                    'total_price': total_price,
                }
                transaction_information.append(transaction)
                
                # Add to orders array without rating and comment
                orders.append({
                    'srNo': len(orders) + 1,
                    'orderedBy': order.ordered_by_name,
                    'menu': order_detail_str,
                    'quantity': plate_count,
                    'totalPrice': total_price
                })

        plates_per_day.append(plate_count)
        customer_data.append({
            'day': day_name,
            'count': count.count() if count else 0
        })
        menu_info = MenuInfo.objects.filter(mess_id=mess_info.mess_id, date=day).first()
        if menu_info:
            menu_data.append({
                'day': day_name,
                'date': day.strftime('%d/%m'),
                'menu': menu_info.menu
            })
    
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    customer_data.sort(key=lambda x: day_order.index(x['day']))
    visited_customers = []
    for i in customer_data:
        visited_customers.append(i.get('count'))
    
    formatted_dates = [day.strftime('%d/%m') for day in last_7_days]
    # Customer Visits -----------------------------------------------------------------------------
    
    # Customer Rating -----------------------------------------------------------------------------
    
    aggregated_data = aggregate_orders(transaction_information)
    predicted_data = get_chatbot_response(aggregated_data)
    
    # Get counts for predicted popular dishes with normalized names
    popular_dish_counts = [0] * len(predicted_data.get('popular_dishes', []))
    for dish in predicted_data.get('popular_dishes', []):
        for i in orders:
            quantity = 0
            if dish in i.get('menu'):
                quantity = i.get('quantity')
                popular_dish_counts[predicted_data.get('popular_dishes', []).index(dish)] = quantity
    
    return JsonResponse({
        "mess_info": mess_info.mess_id, 
        "customer_data": visited_customers, 
        "formatted_dates": formatted_dates, 
        "menu_data": menu_data,
        'predicted_data': predicted_data,
        'plate_count': plates_per_day,
        'orders': orders,
        'popular_dish_counts': popular_dish_counts  # Include counts of popular dishes
    })


def set_menu(request,id):
    return render(request, 'PARTNER/PRT_setupmenu.html',{'id':id})
