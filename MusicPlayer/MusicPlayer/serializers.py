from MusicPlayer.models import Listener, MediaContent, Performer, Artist, Band, Album, Genre, Music, Playlist, \
    Membership
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listener
        fields = ('id', 'email', 'username', 'password')


class ListenerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listener
        fields = ('id', 'email', 'username')


class MediaContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaContent
        fields = ('id', 'name', 'duration')


class PerformerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performer
        fields = ('id', 'name', 'image', 'description')


class ArtistSerializer(PerformerSerializer):
    class Meta:
        model = Artist
        fields = PerformerSerializer.Meta.fields


class BandSerializer(PerformerSerializer):
    class Meta:
        model = Band
        fields = PerformerSerializer.Meta.fields + ('members',)


class AlbumSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('id', 'name', 'release_date', 'image', 'performer')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'title', 'image')


class MusicSerializer(serializers.ModelSerializer):
    likes = ListenerSerializer(many=True, read_only=True)

    class Meta:
        model = Music
        fields = ('id', 'name', 'likes', 'genre', 'performer', 'album', 'image', 'audio_file')

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('id', 'name', 'author', 'order')

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('id', 'playlist', 'music')