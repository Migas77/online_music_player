from datetime import datetime

from django.shortcuts import render
from .models import Listener, MediaContent, Album, Music, Artist, Playlist, Membership

def home(request):
    songs = Music.objects.all()
    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
        'user': request.user,
        'songs': songs,
    }
    return render(request, 'index.html', tparams)
def contact(request):
    tparams = {
        'title': 'Contact',
        'message': 'Your contact page.',
        'year': datetime.now().year,
    }
    return render(request, 'contact.html', tparams)
def about(request):
    tparams = {
        'title': 'About',
        'message': 'Your application description page.',
        'year': datetime.now().year,
    }
    return render(request, 'about.html', tparams)

