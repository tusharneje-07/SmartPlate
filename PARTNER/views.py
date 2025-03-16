
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def prt_dashboard(request,id):
    print("ID is ------------------------- ",id)
    return render(request, 'PARTNER/PRT_dashboard.html')
