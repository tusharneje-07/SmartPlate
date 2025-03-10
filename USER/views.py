from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import UserAuth
from PARTNER.models import MessInfo
from django.db import connection
from math import radians

@login_required
def user_dashboard(request):
    user_id = request.session.get('user_id')
    if user_id:
        user = User.objects.get(id=user_id)
        exitsUser = UserAuth.objects.filter(username=user.username).first()
        if not exitsUser:
            # That means He is New User.
            # Attach Flow to Take All Personal info and Store data.
            print("User is Not Existing in UserAuth")
            return redirect('logout')
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
    print("MessID -------------------- ",mess_id)
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        return render(request,'USR_selectmenue.html')
    else:
        return redirect('logout')
# --------------------------------------------- Order Food 


# ----------------------------------------------------- API
def show_nearby_mess(request):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        lat,lng = 18.458455, 73.866446
        
        print("-----------------------------------")
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
            mess_info['menuItems'] = []
            data.append(mess_info)
        
        return JsonResponse({"data":data})
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
