from datetime import datetime

from django.shortcuts import render, redirect
from .models import Listener, MediaContent, Album, Music, Artist, Playlist, Membership, Performer, Band
from django.contrib.auth import views as auth_views
from MusicPlayer.forms import LoginForm, SignUpForm, MusicSearchForm
from django.contrib.auth import login

# Custom User
def home(request):
    if 'query' in request.GET:
        form = MusicSearchForm(request.GET)
        if form.is_valid():
            query = form.cleaned_data['query']
            songs = Music.objects.filter(name__icontains=query)
    else:
        form = MusicSearchForm()
        songs = Music.objects.all()

    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
        'user': request.user,
        'songs': songs,
        'form': form
    }
    for song in songs:
        print(f"Song: {song.name}, Performer: {song.performer.name if song.performer else 'No Performer'}")
    return render(request, 'index.html', tparams)


def login_signup(request, *args, **kwargs):
    if request.method == 'POST':
        print("here: ", request.POST)
        sign_up_form = SignUpForm(request.POST)
        if sign_up_form.is_valid():

            login(request, user=sign_up_form.save())
            return redirect('home')
    else:
        print("request.method == 'GET'")
        sign_up_form = SignUpForm()
    # temos de mandar sempre os dois porque estão na mesma página
    # portanto não dá para fazer isso apenas com LoginView no forms.py
    return auth_views.LoginView.as_view(
            template_name='login.html',
            authentication_form=LoginForm,
            next_page='home',
            extra_context={"SignUpForm": sign_up_form}
    )(request, *args, **kwargs)


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

    artist_details = Performer.objects.get(name=artist_name)
    artist_albums = Album.objects.filter(performer=artist_details)
    artist_musics = Music.objects.filter(performer=artist_details)

    tparams = {
        'user': request.user,
        'artist_details': artist_details,
        'artist_albums': artist_albums,
        'artist_musics': artist_musics
    }
    return render(request, 'artist.html', tparams)

def adminPanel(request):
    """Get the details, musics and albums from an artist"""

    songs = Music.objects.all()
    albums = Album.objects.all()
    artists = Performer.objects.all()
    bands = Band.objects.all()
    tparams = {
        'songs': songs,
        'albums': albums,
        'artists': artists,
        'bands': bands
    }
    return render(request, 'adminPage.html', tparams)

