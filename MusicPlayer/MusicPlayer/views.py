from datetime import datetime
from django.shortcuts import render, redirect, get_object_or_404
from .models import Listener, MediaContent, Album, Music, Artist, Playlist, Membership, Performer, Band
from django.contrib.auth import views as auth_views
from MusicPlayer.forms import LoginForm, SignUpForm, MusicSearchForm, AddEditArtistForm, AddEditMusicForm, AddEditBandForm, \
    AddEditAlbumForm
from django.contrib.auth import login
from django.db.models import Q

# Custom User
def home(request):
    if request.method == 'POST':
        form = MusicSearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            songs = Music.objects.filter(Q(name__icontains=query) | Q(performer__name__icontains=query) |
                                         Q(genre__icontains=query) | Q(album__name__icontains=query))
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
        form = AddEditArtistForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditArtistForm()

    return render(request, 'add_edit_Artist.html', {'form': form})


def editArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    if request.method == 'POST':
        form = AddEditArtistForm(request.POST, request.FILES, instance=artist)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditArtistForm(instance=artist)
    return render(request, 'add_edit_Artist.html', {'form': form})


def addMusic(request):
    if request.method == 'POST':
        form = AddEditMusicForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditMusicForm()
    return render(request, 'add_edit_Music.html', {'form': form})


def editMusic(request, music_id):
    music = get_object_or_404(Music, id=music_id)
    if request.method == 'POST':
        form = AddEditMusicForm(request.POST, request.FILES, instance=music)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditMusicForm(instance=music)
    return render(request, 'add_edit_Music.html', {'form': form})


def addBand(request):
    if request.method == 'POST':
        form = AddEditBandForm(request.POST, request.FILES)
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
        form = AddEditBandForm()
    return render(request, 'add_edit_Band.html', {'form': form})


def addAlbum(request):
    if request.method == 'POST':
        form = AddEditAlbumForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditAlbumForm()
    return render(request, 'add_edit_Album.html', {'form': form})


def editAlbum(request, album_id):
    album = get_object_or_404(Album, id=album_id)
    if request.method == 'POST':
        form = AddEditAlbumForm(request.POST, request.FILES, instance=album)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditAlbumForm(instance=album)
    return render(request, 'add_edit_Album.html', {'form': form})


def listMusics(request):
    songs = Music.objects.all()
    tparams = {
        'songs': songs
    }
    return render(request, 'listMusics.html', tparams)
