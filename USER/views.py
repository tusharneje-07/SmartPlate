from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

# Create your views here.
@login_required
def user_dashboard(request):
    user_id = request.session.get('user_id')
    if user_id:
        user = User.objects.get(id=user_id)
    print("Username",user.username)
    return render(request, 'dash.html')