from datetime import datetime

from django.shortcuts import render, redirect
from .models import Listener, MediaContent, Album, Music, Artist, Playlist, Membership, Performer, Band
from django.contrib.auth import views as auth_views
from MusicPlayer.forms import LoginForm, SignUpForm, MusicSearchForm, AddArtistForm, AddMusicForm, AddBandForm
from django.contrib.auth import login


# Custom User
def home(request):
    if request.method == 'POST':
        form = MusicSearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            songs = Music.objects.filter(name__icontains=query, performer__name__icontains=query, genre__icontains=query, album__name__icontains=query)
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


def sign_up(request):
    # this view is just intended to be posted from the sign_up form
    # however if the user tries to access through the url he can
    if request.method == 'POST':
        sign_up_form = SignUpForm(request.POST)
        if sign_up_form.is_valid():
            login(request, user=sign_up_form.save())
            return redirect('home')
    else:
        sign_up_form = SignUpForm()
    return auth_views.LoginView.as_view(
        template_name='login.html',
        authentication_form=LoginForm,
        next_page='home',
        extra_context={"SignUpForm": sign_up_form},
    )(request)


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

def addArtist(request):
    if request.method == 'POST':
        form = AddArtistForm(request.POST, request.FILES)
        if form.is_valid():
            name = form.cleaned_data['name']
            description = form.cleaned_data['description']
            image = form.cleaned_data['image']

            artist = Artist(name=name, description=description, image=image)
            artist.save()
            return redirect('adminPanel')
    else:
        form = AddArtistForm()

    return render(request, 'addArtist.html', {'form': form})

def addMusic(request):
    if request.method == 'POST':
        form = AddMusicForm(request.POST, request.FILES)
        if form.is_valid():
            name = form.cleaned_data['name']
            genre = form.cleaned_data['genre']
            album = form.cleaned_data['album']
            performer = form.cleaned_data['performer']
            image = form.cleaned_data['image']
            audio = form.cleaned_data['audio_file']
            duration = form.cleaned_data['duration']  # Adicione esta linha

            music = Music(name=name, genre=genre, album=album, performer=performer, image=image, audio_file=audio, duration=duration)
            music.save()
            return redirect('adminPanel')
    else:
        form = AddMusicForm()

    return render(request, 'addMusic.html', {'form': form})

def addBand(request):
    if request.method == 'POST':
        form = AddBandForm(request.POST, request.FILES)
        if form.is_valid():
            name = form.cleaned_data['name']
            description = form.cleaned_data['description']
            image = form.cleaned_data['image']
            members_ids = form.cleaned_data['members']

            members = Artist.objects.filter(id__in=members_ids)

            band = Band(name=name, description=description, image=image)
            band.save()
            band.members.add(*members)
            return redirect('adminPanel')
    else:
        form = AddBandForm()
    return render(request, 'addBand.html', {'form': form})
