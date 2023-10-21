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

# endpoint /artist/<str:artist_name>
def artistInformation(request, artist_name):
    """Get the details, musics and albums from an artist"""

    artist_details = Artist.objects.get(name=artist_name)
    artist_albums = Album.objects.get(artist__name=artist_name)
    artist_musics = Music.objects.get(artist__name=artist_name)

    tparams = {
        'user': request.user,
        'artist_details': artist_details,
        'artist_albums': artist_albums,
        'artist_musics': artist_musics
    }
    return render(request, 'artist.html', tparams)

