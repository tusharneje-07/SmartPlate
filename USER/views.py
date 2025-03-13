from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import UserAuth
from PARTNER.models import MessInfo, MenuInfo, OrderInformation
from django.db import connection
from math import radians
from datetime import datetime
import string,random, time, json

@login_required
def user_dashboard(request):
    user_id = request.session.get('user_id')
    if user_id:
        user = User.objects.get(id=user_id)
        exitsUser = UserAuth.objects.filter(username=user.username).first()
        if not exitsUser:
            inuser = User.objects.filter(username=user.username).first()
            if inuser:
                new_user = UserAuth.objects.create(
                    username=user.username,
                    password='pass',
                    type='#00'
                )
                if new_user:
                    print("New User Created in User Auth!")
                    request.session[f'{user.username}_auth'] = True
            print("User is Not Existing in UserAuth")
            # return redirect('/user_logout/')
        else:
            request.session[f'{user.username}_auth'] = True
            print("User Authenticated")

    return render(request, 'USR_dashboard.html')

# --------------------------------------------- Order Food 
def seach_mess(request):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        return render(request,'USR_searchmess.html')
    else:
        return redirect('logout')

def select_menu(request,mess_id):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        return render(request,'USR_selectmenue.html')
    else:
        return redirect('logout')
    
def go_to_cart(request,mess_id):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        return render(request,'USR_payment.html')
    else:
        return redirect('logout')    
    
def process_payment(request,mess_id):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        if not request.session.get(f"{username}_payment") and request.session.get(f"{username}_payment")['status']:
            return JsonResponse({"msg":"Error Occured!"})
        
        
        order_details_data = request.session.get(f"{username}_payment")
        print(order_details_data)
        return render(request,'USR_orderplaced.html',order_details_data)

    else:
        return redirect('logout')
# --------------------------------------------- Order Food 


# ----------------------------------------------------- API
def show_nearby_mess(request):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        lat,lng = 18.458455, 73.866446
        
        nearby = get_nearby_messes(lat, lng)
        nearby_mess_ids = []
        nearby_mess_distace = []
        for mess in nearby:
            nearby_mess_ids.append(mess['mess_id'])
            nearby_mess_distace.append(mess['distance'])
        
        messes = MessInfo.objects.filter(mess_id__in=nearby_mess_ids)
        data = []
        for mess in messes:
            mess_info = {}
            mess_info['messId'] = mess.mess_id
            mess_info['imgs'] = mess.get_image_url()
            mess_info['openTime'] = mess.open_time
            mess_info['messName'] = mess.mess_name
            mess_info['messAddress'] = mess.mess_address
            mess_info['messAddress'] = mess.mess_address
            mess_info['crowdStatus'] = mess.crowd_status
            mess_info['messRating'] = mess.mess_rating
            mess_info['geocodes'] = [mess.geo_lat,mess.geo_lng]
            mess_info['keyword'] = mess.keywords.get('keyword', [])
            
            # Fetching Menu
            formatted_date = datetime.now().strftime("%Y-%m-%d")
            item = MenuInfo.objects.filter(mess_id=mess.mess_id,date=formatted_date).first()
            
            mess_info['menuItems'] = item.menu
            
            data.append(mess_info)
        
        return JsonResponse({"data":data})

def payment_api(request,mess_id,payment_amount):
    print("----------------------------",mess_id)
    if not request.COOKIES.get('temp_user_cart'):
        data = {
        'payment_amount' : payment_amount,
        'status' :  False,
        'error' : 'Cookie is Not set! Temp Cookie is missing.'
        }
        return JsonResponse(data)
    
    order_data = json.loads(request.COOKIES.get('temp_user_cart'))
    print(order_data)
    order_details = []
    for data in order_data:
        order = {}
        order['name'] = data['name']
        order['details'] = data['details']
        order['price'] = data['price']
        order['quantity'] = data['quantity']
        order_details.append(order)
    
    username = request.COOKIES.get('smartplate_auth_user_log')
    
    characters = string.ascii_uppercase + string.digits
    UID =  ''.join(random.choices(characters, k=4))
    user_info = User.objects.filter(username=username).first()
    user_full_name = user_info.first_name + " " + user_info.last_name
    
    
    try:
        user = User.objects.filter(username=username).first()
        order = OrderInformation.objects.create(
            mess_id=mess_id,
            order_id=UID,
            ordered_by=user,
            ordered_by_name=user_full_name,
            order_details=order_details
        )
        
        data = {
            'payment_amount' : payment_amount,
            'status' :  True,
            'error' : 'NA',
            'order_details' : order_details,
            'UID' : UID,
        }
        request.session[f'{username}_payment'] = data
        return JsonResponse(data)

    except json.JSONDecodeError as e:
        print(e)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except User.DoesNotExist as e:
        print(e)
        return JsonResponse({"error": "User not found"}, status=404)
    
def get_current_payment(request):
    username = request.COOKIES.get('smartplate_auth_user_log')
    return JsonResponse(request.session.get(f"{username}_payment"))

def getCrowdStatus(request,mess_id):
    if not mess_id:
        return JsonResponse({'status': False})
    data = MessInfo.objects.filter(mess_id=mess_id).values('crowd_status')
    data = data[0]
    print(data)
    ret_data = {
        'status' : True,
        'crowd' : data['crowd_status']
    }
    return JsonResponse(ret_data)
# ----------------------------------------------------- API

# -------------------------------------------- Common Functions
def get_nearby_messes(user_lat, user_lng):
    radius_km = 10 
    earth_radius = 6371

    query = f"""
    SELECT mess_id, (
        {earth_radius} * ACOS(
            COS(RADIANS({user_lat})) * COS(RADIANS(geo_lat)) *
            COS(RADIANS(geo_lng) - RADIANS({user_lng})) +
            SIN(RADIANS({user_lat})) * SIN(RADIANS(geo_lat))
        )
    ) AS distance
    FROM partner_messinfo
    HAVING distance <= {radius_km}
    ORDER BY distance ASC;
    """

    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return results
# -------------------------------------------- Common Functions
