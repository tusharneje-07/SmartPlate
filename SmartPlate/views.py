from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import redirect
from PARTNER.models import PartnerInfo
import json
import hashlib
import requests
from datetime import datetime, timedelta

def revoke_google_token(access_token):
    try:
        requests.post('https://oauth2.googleapis.com/revoke',
            params={'token': access_token},
            headers={'content-type': 'application/x-www-form-urlencoded'})
    except:
        pass

def google_login(request):
    return redirect('social:begin', 'google-oauth2')

def partner_google_login(request, type):
    if type == '1':
        request.session['partner_login'] = True
    return redirect('social:begin', 'google-oauth2')

def welcome(request):
    return render(request, 'index.html')

@login_required
def auth_pass(request):
    
    # Login as Partner
    if request.session.get('partner_login'):
        user = request.user
        partner_info = PartnerInfo.objects.get(username=user.username)
        if not partner_info:
            pass # TODO: Add New Account Creation info
            error = {
                'error': 'User is Not Registered Yet | Partner Login Failure'
            }
            return JsonResponse(error)
        else:
            respo = redirect(f'/partner/{user.username}')
            expires = datetime.utcnow() + timedelta(days=365 * 10)
            respo.set_cookie('smartplate_auth_partner_log', user.username, expires=expires, httponly=True)
            return respo
            
        # Error Failure  
        error = {
            'error': 'Invalid Credentials | Partner Login Failure'
        }
        return JsonResponse(error)
    
    # Login as User
    user = request.user
    request.session['user_id'] = user.id
    respo = redirect('/user')
    expires = datetime.utcnow() + timedelta(days=365 * 10)
    respo.set_cookie('smartplate_auth_user_log', user.username, expires=expires, httponly=True)
    return respo

def user_logout(request):
    access_token = request.session.get('access_token')
    print("Access Token: ", access_token)
    if access_token:
        revoke_google_token(access_token)
    
    logout(request) 
    respo = redirect(f'/welcome')
    respo.delete_cookie('smartplate_auth_user_log')
    return respo 

def partner_logout(request):
    access_token = request.session.get('access_token')
    print("Access Token: ", access_token)
    if access_token:
        revoke_google_token(access_token)
    
    logout(request) 
    respo = redirect(f'/welcome')
    respo.delete_cookie('smartplate_auth_partner_log')
    return respo


# GLOBAL ENTRY POINTS
def user_login(request):
    return render(request,'USR_login.html')

def partner_login(request):
    return render(request,'PARTNER/PRT_login.html')
