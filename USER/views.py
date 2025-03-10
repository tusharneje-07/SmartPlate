from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import UserAuth

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

def seach_mess(request):
    username = request.COOKIES.get('smartplate_auth_user_log')
    if request.session.get(f'{username}_auth'):
        return render(request,'USR_searchmess.html')
    else:
        return redirect('logout')