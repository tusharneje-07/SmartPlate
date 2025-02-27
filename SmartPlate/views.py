from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import redirect

def google_login(request):
    return redirect('social:begin', 'google-oauth2')

def welcome(request):
    return render(request, 'index.html')

@login_required
def dashboard(request):
    print(request)
    user = request.user
    return render(request, 'dash.html',{'user': user})

def user_logout(request):
    access_token = request.session.get('access_token')
    print("Access Token: ", access_token)
    if access_token:
        revoke_google_token(access_token)  # Revoke the Google OAuth2 token
    
    logout(request)  # Logs out from Django session
    return redirect('/welcome')  # Redirect after logout



# GLOBAL ENTRY POINTS
def user_login(request):
    return render(request,'U_TRY_LOGIN.html')
