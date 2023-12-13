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
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
### Web Services 2nd Project
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from MusicPlayer.serializers import MusicSerializer, GenreSerializer, AlbumSerializer, ArtistSerializer, BandSerializer, \
    ListenerSerializer, UserSerializer
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer


# Custom User
def home(request):
    if request.method == 'POST':
        page = request.POST.get("page")
        formSearch = MusicSearchForm(request.POST)
        if formSearch.is_valid():
            query = formSearch.cleaned_data['query']
            songs = Music.objects.filter(
                Q(name__icontains=query) | Q(performer__name__icontains=query) | Q(genre__title__icontains=query) | Q(
                    album__name__icontains=query))
            # successfull search -> clean form
            formSearch = MusicSearchForm()
            songs_by_genre = {genre: list(songs) for genre, songs in
                              groupby(sorted(songs, key=lambda music: music.genre.title.upper()),
                                      key=lambda music: music.genre.title.upper())}.items()

    else:
        formSearch = MusicSearchForm()
        songs = Music.objects.all()
        page = request.GET.get("page")
        songs_by_genre = {genre: list(songs) for genre, songs in
                          groupby(sorted(songs, key=lambda music: music.genre.title.upper()),
                                  key=lambda music: music.genre.title.upper())}
        # Only want pages if I didn't search anything
        pgtr = Paginator(tuple(songs_by_genre.items()), 5)
        try:
            songs_by_genre = pgtr.page(page)
        except (PageNotAnInteger, EmptyPage):
            # It will enter here when
            # the page is not specified
            # specified badly
            # page is empty
            songs_by_genre = pgtr.page(1)

    if request.user.is_authenticated:
        playl = Playlist.objects.filter(author=request.user)
    else:
        playl = None

    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
        'user': request.user,
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


def about(request):
    tparams = {
        'year': datetime.now().year,
    }
    return render(request, 'about.html', tparams)


@login_required
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


@login_required
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


@login_required
def addArtist(request):
    if request.method == 'POST':
        form = AddEditArtistForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditArtistForm()

    return render(request, 'add_edit_Artist.html', {'form': form})


@login_required
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


@login_required
def getAlbumsByPerfomer(request):
    performer_name = request.GET.get('performer_name')
    print("PERFORMER NAME: ", performer_name)
    if performer_name is not None:
        albums = Album.objects.filter(performer__name=performer_name).values('name', 'id')
        return JsonResponse(list(albums), safe=False)
    else:
        return JsonResponse({"error": "No performer is provided"}, status=400)


@login_required
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


@login_required
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


@login_required
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


@login_required
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


@login_required
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


@login_required
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


@login_required
def deleteMusic(request, id):
    music = Music.objects.get(id=id)
    music.delete()
    return redirect('listMusics')


@login_required
def listAlbuns(request):
    albuns = Album.objects.all()
    tparams = {
        'albuns': albuns
    }
    return render(request, 'listAlbuns.html', tparams)


@login_required
def deleteAlbum(request, id):
    album = Album.objects.get(id=id)
    album.delete()
    return redirect('listAlbuns')


@login_required
def listArtists(request):
    artists = Artist.objects.all()
    tparams = {
        'artists': artists
    }
    return render(request, 'listArtists.html', tparams)


@login_required
def deleteArtist(request, id):
    artist = Artist.objects.get(id=id)
    artist.delete()
    return redirect('listArtists')


@login_required
def listBands(request):
    bands = Band.objects.all()
    tparams = {
        'artists': bands
    }
    return render(request, 'listBands.html', tparams)


@login_required
def deleteBand(request, id):
    band = Band.objects.get(id=id)
    band.delete()
    return redirect('listBands')


@login_required
def editBand(request, band_id):
    band = get_object_or_404(Band, id=band_id)
    if request.method == 'POST':
        form = AddEditBandForm(request.POST, request.FILES, instance=band)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditBandForm(instance=band)
    return render(request, 'add_edit_Band.html', {'form': form})


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
        'memberships': playlist.get_memberships()
    }
    # print([m.music for m in playlist.membership_set.all()])
    # print(playlist.get_musics())
    # print(playlist.membership_set.first().added_date)
    return render(request, 'playlistInfo.html', tparams)


@login_required
def add_to_playlist(request):
    if request.method == 'POST':
        playlist_id = request.POST.get('playlist_id')
        song_id = request.POST.get('song_id')
        try:
            membership = Membership(playlist_id=playlist_id, music_id=song_id)
            membership.save()
        except IntegrityError:
            # this error occurs when Membership with that song and playlist already exists
            return HttpResponse(json.dumps({"success": False}), content_type='application/json')

        return HttpResponse(json.dumps({"success": True}), content_type='application/json')

    else:
        return HttpResponse(json.dumps({"success": False}), content_type='application/json')


@login_required
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


@login_required
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


@login_required
def deletePlaylist(request, id):
    playlist = Playlist.objects.get(id=id)
    playlist.delete()
    return redirect('playlists')


@login_required
def deleteSongPlaylist(request, songId, playlistId):
    membership = Membership.objects.get(playlist_id=playlistId, music_id=songId)
    membership.delete()
    return redirect('playlistInfo', playlist_id=playlistId)


@login_required
def songQueue(request):
    # se eliminar música musics_ids não estará atualizado
    # mas não há stress porque da maneira que está não dá erro
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


@login_required
def addGenre(request):
    if request.method == 'POST':
        form = AddEditGenreForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('adminPanel')
    else:
        form = AddEditGenreForm()
    return render(request, 'add_edit_Genre.html', {'form': form})


@login_required
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


@login_required
def deleteGenre(request, id):
    try:
        genre = Genre.objects.get(id=id)
        genre.delete()
    except ProtectedError:
        return render(request, 'listGenres.html', {
            'genres': Genre.objects.all(),
            'deletionErrors': _(
                "We're sorry but you can't delete this Genre because it's still the gender of some existing tracks.")
        })

    return redirect('listAlbuns')


@login_required
def listGenres(request):
    genres = Genre.objects.all()
    tparams = {
        'genres': genres
    }
    return render(request, 'listGenres.html', tparams)


### Web Services 2nd Project


@api_view(['POST'])
def auth_sign_in(request):
    serializer = AuthTokenSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    token, created = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user_id': user.pk,
        'user_email': user.email
    })


@api_view(['POST'])
def auth_sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email_email': user.email
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_musics_by_genre(request):
    musics = Music.objects.all()
    serialized_data = {genre: MusicSerializer(musics, many=True).data for genre, musics in
                       groupby(sorted(musics, key=lambda music: music.genre.title.upper()),
                               key=lambda music: music.genre.title.upper())}
    return Response(serialized_data)


@api_view(['GET'])
#@authentication_classes([SessionAuthentication, TokenAuthentication])
#@permission_classes([IsAuthenticated])
def get_musics(request):
    musics = Music.objects.all()
    serializer = MusicSerializer(musics, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_genres(request):
    genres = Genre.objects.all()
    serializer = GenreSerializer(genres, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_albums(request):
    albums = Album.objects.all()
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_artists(request):
    artists = Artist.objects.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_bands(request):
    bands = Band.objects.all()
    serializer = BandSerializer(bands, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_artist(request):
    serializer = ArtistSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_artist(request, id):
    try:
        artist = Artist.objects.get(id=id)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ArtistSerializer(artist)
    return Response(serializer.data)

@api_view(['PUT'])
def update_artist(request, id):
    try:
        artist = Artist.objects.get(id=id)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request.data._mutable = True
    if request.data.get('image') == '':
        request.data['image'] = artist.image
    request.data._mutable = False
    serializer = ArtistSerializer(artist, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_artist(request, id):
    try:
        artist = Artist.objects.get(id=id)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    artist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_genre(request, id):
    try:
        genre = Genre.objects.get(id=id)
    except Genre.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = GenreSerializer(genre)
    return Response(serializer.data)

@api_view(['POST'])
def add_genre(request):
    serializer = GenreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_genre(request, id):
    try:
        genre = Genre.objects.get(id=id)
    except Genre.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    genre.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_genre(request, id):
    try:
        genre = Genre.objects.get(id=id)
    except Genre.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request.data._mutable = True
    if request.data.get('image') == '':
        request.data['image'] = genre.image
    request.data._mutable = False
    serializer = GenreSerializer(genre, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_band(request, id):
    try:
        band = Band.objects.get(id=id)
    except Band.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = BandSerializer(band)
    return Response(serializer.data)

@api_view(['POST'])
def add_band(request):
    serializer = BandSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_band(request, id):
    try:
        band = Band.objects.get(id=id)
    except Band.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    band.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_band(request, id):
    try:
        band = Band.objects.get(id=id)
    except Band.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request.data._mutable = True
    if request.data.get('image') == '':
        request.data['image'] = band.image
    request.data._mutable = False
    serializer = BandSerializer(band, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_album(request, id):
    try:
        album = Album.objects.get(id=id)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = AlbumSerializer(album)
    return Response(serializer.data)

@api_view(['POST'])
def add_album(request):
    serializer = AlbumSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_album(request, id):
    try:
        album = Album.objects.get(id=id)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    album.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_album(request, id):
    try:
        album = Album.objects.get(id=id)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request.data._mutable = True
    if request.data.get('image') == '':
        request.data['image'] = album.image
    request.data._mutable = False
    serializer = AlbumSerializer(album, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_music(request, id):
    try:
        music = Music.objects.get(id=id)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = MusicSerializer(music)
    return Response(serializer.data)

@api_view(['POST'])
def add_music(request):
    serializer = MusicSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_music(request, id):
    try:
        music = Music.objects.get(id=id)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    music.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_music(request, id):
    try:
        music = Music.objects.get(id=id)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request.data._mutable = True
    if request.data.get('image') == '':
        request.data['image'] = music.image
    if request.data.get('audio_file') == '':
        request.data['audio_file'] = music.audio_file
    request.data._mutable = False
    serializer = MusicSerializer(music, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def search_music(request):
    query = request.data['query']
    print(query)

    songs = Music.objects.filter(
        Q(name__icontains=query) | Q(performer__name__icontains=query) | Q(genre__title__icontains=query) | Q(album__name__icontains=query)
    )

    serializer = MusicSerializer(songs, many=True)
    return Response(serializer.data)

