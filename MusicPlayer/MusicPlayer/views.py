from datetime import datetime
from io import StringIO

from django.core.handlers.wsgi import WSGIRequest

import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from .models import Album, Music, Artist, Playlist, Membership, Performer, Band, Genre
from django.contrib.auth import views as auth_views
from MusicPlayer.forms import LoginForm, SignUpForm, MusicSearchForm, AddEditArtistForm, AddEditMusicForm, \
    AddEditBandForm, \
    AddEditAlbumForm, AddEditPlaylistForm, AddEditGenreForm
from django.contrib.auth import login
from django.db.models import Q, Case, When, Value, BooleanField, ProtectedError
from itertools import groupby
from django.http import JsonResponse


# Custom User
def home(request):
    if request.method == 'POST':
        formSearch = MusicSearchForm(request.POST)
        if formSearch.is_valid():
            query = formSearch.cleaned_data['query']
            songs = Music.objects.filter(
                Q(name__icontains=query) | Q(performer__name__icontains=query) | Q(genre__title__icontains=query) | Q(
                    album__name__icontains=query))

    else:
        formSearch = MusicSearchForm()
        songs = Music.objects.all()

    songs_by_genre = {genre: list(songs) for genre, songs in
                      groupby(sorted(songs, key=lambda music: music.genre.title.upper()),
                              key=lambda music: music.genre.title.upper())}

    if request.user.is_authenticated:
        playl = Playlist.objects.filter(author=request.user)
    else:
        playl = None

    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
        'user': request.user,
        'songs': songs,
        'songs_by_genre': songs_by_genre,
        'playlists': playl,
        'formSearch': formSearch,
        'formPlaylist': AddEditPlaylistForm()
    }

    for song in songs:
        print(f"Song: {song.name}, Performer: {song.performer.name if song.performer else 'No Performer'}")
    return render(request, 'index.html', tparams)


def sign_up(request):
    # this view is just intended to be posted from the sign_up form
    if request.method == 'POST':
        sign_up_form = SignUpForm(request.POST)
        if sign_up_form.is_valid():
            login(request, user=sign_up_form.save())
            return redirect('home')
    else:
        sign_up_form = SignUpForm()

    # Create Fake Request Without the POST data
    # Necessary because if we passed the request to LoginView.as_view()
    # the view would process data common to both forms like username for example
    fake_request = WSGIRequest({
        'REQUEST_METHOD': 'GET',
        'wsgi.input': StringIO(),
    })
    fake_request.META = request.META

    return auth_views.LoginView.as_view(
        template_name='login.html',
        authentication_form=LoginForm,
        next_page='home',
        extra_context={"SignUpForm": sign_up_form},
    )(fake_request)


def contact(request):
    tparams = {
        'title': 'Contact',
        'message': 'Your contact page.',
        'year': datetime.now().year,
    }
    return render(request, 'contact.html', tparams)


def about(request):
    tparams = {
        'year': datetime.now().year,
    }
    return render(request, 'about.html', tparams)


def artistInformation(request, artist_name):
    try:
        artist_details = Artist.objects.get(name=artist_name)
        artist_type = "Artist"
    except Artist.DoesNotExist:
        artist_details = Band.objects.get(name=artist_name)
        artist_type = "Band"

    artist_albums = Album.objects.filter(performer=artist_details)
    artist_musics = Music.objects.filter(performer=artist_details)

    # This adds an additional field called user_liked (boolean) to each item in the artists_musics to check if the user has liked each song
    if request.user.is_authenticated:
        artist_musics = artist_musics.annotate(
            user_liked=Case(
                When(likes__id=request.user.id, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        )
        playl = Playlist.objects.filter(author=request.user)
    else:
        playl = None

    tparams = {
        'artist_details': artist_details,
        'artist_albums': artist_albums,
        'artist_musics': artist_musics,
        'artist_type': artist_type,
        'playlists': playl,
        'formPlaylist': AddEditPlaylistForm()
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

def getAlbumsByPerfomer(request):
    performer_name = request.GET.get('performer_name')
    print("PERFORMER NAME: ", performer_name)
    if performer_name is not None:
        albums = Album.objects.filter(performer__name=performer_name).values('name', 'id')
        return JsonResponse(list(albums), safe=False)
    else:
        return JsonResponse({"error": "No performer is provided"}, status=400)

def addMusic(request):
    if request.method == 'POST':
        form = AddEditMusicForm(request.POST, request.FILES)
        if form.is_valid():
            music = form.save()
            album = music.album
            album.duration = album.calculate_duration()
            album.save()
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
            album = form.save()
            album.duration = album.calculate_duration()
            album.save()
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

@login_required
def addLike(request):
    music_id = request.POST.get("music_id")

    try:
        music = Music.objects.get(id=music_id)
        print(type(request.user))
        music.likes.add(request.user.id)
        return JsonResponse({"success": True, "likes": music.total_likes})

    except Music.DoesNotExist:
        return JsonResponse({"success": False, "error": "Music not found"})

@login_required
def removeLike(request):
    music_id = request.POST.get("music_id")

    try:
        music = Music.objects.get(id=music_id)
        print(type(request.user))
        music.likes.remove(request.user.id)
        return JsonResponse({"success": True, "likes": music.total_likes})

    except Music.DoesNotExist:
        return JsonResponse({"success": False, "error": "Music not found"})


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


@login_required
def playlists(request):
    playlists = Playlist.objects.filter(author=request.user)
    tparams = {
        'playlists': playlists
    }
    return render(request, 'playlists.html', tparams)


@login_required
def playlistInfo(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    tparams = {
        'playlist': playlist,
        'musics': playlist.get_musics()
    }
    return render(request, 'playlistInfo.html', tparams)


def add_to_playlist(request):
    if request.method == 'POST':
        playlist_id = request.POST.get('playlist_id')
        song_id = request.POST.get('song_id')
        membership = Membership(playlist_id=playlist_id, music_id=song_id)
        membership.save()

        return HttpResponse(json.dumps({"success": True}), content_type='application/json')

    else:
        return HttpResponse(json.dumps({"success": False}), content_type='application/json')


def sortPlaylist(request):
    if request.method == 'POST':
        playlist_id = request.POST.get('playlist_id')
        prev_position = int(request.POST.get('prev_position'))
        next_position = int(request.POST.get('next_position'))
        pl = Playlist.objects.get(id=playlist_id)
        pl.change_order(prev_position, next_position)

        return HttpResponse(json.dumps({"success": True}), content_type='application/json')

    else:
        return HttpResponse(json.dumps({"success": False}), content_type='application/json')


def add_playlist(request):
    if request.method == 'POST':
        playlistName = request.POST.get("playlistName")
        if playlistName:
            playl = Playlist(name=playlistName, author=request.user)
            playl.save()

            return JsonResponse({
                'success': True,
                'playlist': {
                    'id': playl.id,
                    'name': playl.name,
                    # inclua outros campos da playlist se necessário
                }})
    return HttpResponse(json.dumps({"success": False}), content_type='application/json')


def deletePlaylist(request, id):
    playlist = Playlist.objects.get(id=id)
    playlist.delete()
    return redirect('playlists')


def deleteSongPlaylist(request, songId, playlistId):
    membership = Membership.objects.get(playlist_id=playlistId, music_id=songId)
    membership.delete()
    return redirect('playlistInfo', playlist_id=playlistId)

@login_required
def songQueue(request):
    music_ids = request.session.get("music_ids", [])
    musics = Music.objects.filter(id__in=music_ids)
    return render(request, 'songQueue.html', {'musics': musics})

@login_required
def removeMusicFromQueue(request, id):
    music_ids = request.session.get("music_ids", [])
    if id == 0:
        print("Clearing queue")
        music_ids.clear()
        request.session.save()
        return redirect('songQueue')
    music_ids.remove(str(id))
    request.session.save()
    return redirect('songQueue')


def addGenre(request):
    if request.method == 'POST':
        form = AddEditGenreForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditGenreForm()
    return render(request, 'add_edit_Genre.html', {'form': form})


def editGenre(request, genre_id):
    genre = get_object_or_404(Genre, id=genre_id)
    if request.method == 'POST':
        form = AddEditGenreForm(request.POST, request.FILES, instance=genre)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditGenreForm(instance=genre)
    return render(request, 'add_edit_Genre.html', {'form': form})


def deleteGenre(request, id):
    try:
        genre = Genre.objects.get(id=id)
        genre.delete()
    except ProtectedError:
        return render(request, 'listGenres.html', {
            'genres': Genre.objects.all(),
            'deletionErrors': "We're sorry but you can't delete this Genre because it's still the gender of some existing tracks."
        })

    return redirect('listAlbuns')


def listGenres(request):
    genres = Genre.objects.all()
    tparams = {
        'genres': genres
    }
    return render(request, 'listGenres.html', tparams)
