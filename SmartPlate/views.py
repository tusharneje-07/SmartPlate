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
    logout(request)
    return redirect('/welcome')


# GLOBAL ENTRY POINTS
def user_login(request):
    return render(request,'U_LOGIN.html')
