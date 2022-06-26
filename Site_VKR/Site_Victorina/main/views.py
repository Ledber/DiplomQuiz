from multiprocessing import context
import re
from django.shortcuts import render, redirect
import sqlite3, hashlib
import json



def index(request):
    return render(request,'index.html')


def logIn(request):
    return render(request,'autorize.html')


def signInUser(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        result = json.loads(request.POST.get('name'))
        if result["resultQuery"] == 'succ':
            request.session['First Name'] = result['firstName']
            request.session['Last Name'] = result['lastName']
        
        return redirect('main')
    else:
        return redirect('main')



def signInAdmin(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        result = json.loads(request.POST.get('name'))
        if result["resultQuery"] == 'succ':
            request.session['First Name'] = result['firstName']
            request.session['Last Name'] = result['lastName']
        return redirect('main')
    else:
        return redirect('main')



def adminForm(request):
    context = {
        "FirstName": request.session['First Name'],
        "LastName": request.session['Last Name']
    }
    return render(request,'admin.html',context=context)


def GetVictorinaAndGetResultPlaygrouthCreate(request):
    return redirect('admin_form')



def resultVictorina(request):
    context= {
        "FirstName":request.session['First Name'],
        "LastName":request.session['Last Name']
    }
    return render(request,'results.html',context=context)





def startVictorina(request):
    context = {
        "FirstName": request.session['First Name'],
        "LastName": request.session['Last Name']
    }
    return render(request,'question.html',context=context)



def studentVictorina(request):
    context = {
        "FirstName": request.session['First Name'],
        "LastName": request.session['Last Name']
    }
    return render(request,'studentStart.html',context=context)