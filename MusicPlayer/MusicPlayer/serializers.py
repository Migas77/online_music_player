from MusicPlayer.models import Listener, MediaContent, Performer, Artist, Band, Album, Genre, Music, Playlist, \
    Membership
from rest_framework import serializers


class ListenerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listener
        fields = ('id', 'followers', 'email')


class MediaContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaContent
        fields = ('id', 'name', 'duration')


class PerformerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performer
        fields = ('id', 'name', 'image', 'description')


class ArtistSerializer(PerformerSerializer):
    pass


class BandSerializer(PerformerSerializer):
    members = ArtistSerializer(read_only=True)

    class Meta:
        model = Band
        fields = PerformerSerializer.Meta.fields + ('members',)


class AlbumSerializer(serializers.ModelSerializer):
    performer = PerformerSerializer(read_only=True)

    class Meta:
        model = Album
        fields = ('id', 'name', 'release_date', 'image', 'performer')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'title', 'image')


class MusicSerializer(serializers.ModelSerializer):
    likes = ListenerSerializer(many=True, read_only=True)
    genre = GenreSerializer(read_only=True)
    performer = PerformerSerializer(read_only=True)
    album = AlbumSerializer(read_only=True)

    class Meta:
        model = Music
        fields = ('id', 'likes', 'genre', 'performer', 'album', 'image', 'audio_file')