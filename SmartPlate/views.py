from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import redirect
import json
import hashlib
from datetime import datetime, timedelta
def google_login(request):
    return redirect('social:begin', 'google-oauth2')

def welcome(request):
    return render(request, 'index.html')

@login_required
def auth_pass(request):
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
    return redirect('/welcome') 


# GLOBAL ENTRY POINTS
def user_login(request):
    return render(request,'USR_login.html')

