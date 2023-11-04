from datetime import datetime

import json
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from .models import Listener, MediaContent, Album, Music, Artist, Playlist, Membership, Performer, Band, Like
from django.contrib.auth import views as auth_views
from MusicPlayer.forms import LoginForm, SignUpForm, MusicSearchForm, AddEditArtistForm, AddEditMusicForm, AddEditBandForm, \
    AddEditAlbumForm
from django.contrib.auth import login
from django.db.models import Q, Case, When, Value, BooleanField
from itertools import groupby


# Custom User
def home(request):
    
    if request.method == 'POST':
        form = MusicSearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            songs = Music.objects.filter(Q(name__icontains=query) | Q(performer__name__icontains=query) |
                                         Q(genre__icontains=query) | Q(album__name__icontains=query))
            
            songs_by_genre = {genre: list(songs) for genre, songs in groupby(sorted(songs, key=lambda song: song.genre.upper()), key=lambda song: song.genre.upper())}

    else:
        form = MusicSearchForm()
        songs = Music.objects.all()
        songs_by_genre = {genre: list(songs) for genre, songs in groupby(sorted(songs, key=lambda song: song.genre.upper()), key=lambda song: song.genre.upper())}
    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
        'user': request.user,
        'songs': songs,
        'songs_by_genre': songs_by_genre,
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
    try:
        artist_details = Artist.objects.get(name=artist_name)
        artist_type = "Artist"
    except Artist.DoesNotExist:
        artist_details = Band.objects.get(name=artist_name)
        artist_type = "Band"

    artist_albums = Album.objects.filter(performer=artist_details)
    artist_musics = Music.objects.filter(performer=artist_details)

    print(request.user)
    # This adds an additional field called user_liked (boolean) to each item in the artists_musics to check if the user has liked each song
    if request.user.is_authenticated:
        artist_musics = artist_musics.annotate(
            user_liked=Case(
                When(likes__user=request.user, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        )

    tparams = {
        'artist_details': artist_details,
        'artist_albums': artist_albums,
        'artist_musics': artist_musics,
        'artist_type': artist_type,
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
        form = AddBandForm()
    return render(request, 'addBand.html', {'form': form})


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


# AJAX views
def is_ajax(request):
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'


def addLike(request):
    music_id = request.POST.get("music_id")
    user_id = request.POST.get("user_id")
    
    try:
        music = Music.objects.get(id=music_id)
        user = Listener.objects.get(id=user_id)

        like, create = Like.objects.get_or_create(user=user, music=music)

        likes = music.total_likes
        return HttpResponse(json.dumps({"success": True, "likes": likes}), content_type='application/json')
    
    except Music.DoesNotExist:
        return HttpResponse(json.dumps({"success": False, "error": "Music not found"}))

def removeLike(request):
    music_id = request.POST.get("music_id")
    user_id = request.POST.get("user_id")

    try:
        music = Music.objects.get(id=music_id)
        user = Listener.objects.get(id=user_id)
        Like.objects.filter(user=user, music=music_id).delete()

        likes = music.total_likes
        return HttpResponse(json.dumps({"success": True, "likes": likes}), content_type='application/json')
    
    except Music.DoesNotExist:
        return HttpResponse(json.dumps({"success": False, "error": "Music not found"}))

def addMusicToQueue(request):
    music_id = request.POST["music_id"]
    if not is_ajax(request) or request.method != 'POST' or not music_id:
        return redirect('')
    music_ids = request.session.setdefault("music_ids", [])
    if music_id not in music_ids:
        music_ids.append(music_id)
        request.session.save()
    return HttpResponse(json.dumps({"success": True}), content_type='application/json')

def deleteMusic(request, id):
    music = Music.objects.get(id=id)
    music.delete()
    return redirect('listMusics')

def listAlbuns(request):
    albuns = Album.objects.all()
    tparams = {
        'albuns': albuns
    }
    return render(request, 'listAlbuns.html', tparams)

def deleteAlbum(request, id):
    album = Album.objects.get(id=id)
    album.delete()
    return redirect('listAlbuns')

def listArtists(request):
    artists = Artist.objects.all()
    tparams = {
        'artists': artists
    }
    return render(request, 'listArtists.html', tparams)

def deleteArtist(request, id):
    artist = Artist.objects.get(id=id)
    artist.delete()
    return redirect('listArtists')

def listBands(request):
    bands = Band.objects.all()
    tparams = {
        'artists': bands
    }
    return render(request, 'listBands.html', tparams)

def deleteBand(request, id):
    band = Band.objects.get(id=id)
    band.delete()
    return redirect('listBands')

def editBand(request, band_id):
    band = get_object_or_404(Band, id=band_id)
    if request.method == 'POST':
        form = AddEditBandForm(request.POST, request.FILES, instance=band)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditBandForm(instance=band)
    return render(request, 'add_edit_Artist.html', {'form': form})