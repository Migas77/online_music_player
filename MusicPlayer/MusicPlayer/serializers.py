from MusicPlayer.models import Listener, MediaContent, Performer, Artist, Band, Album, Genre, Music, Playlist, \
    Membership
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

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
        fields = ('id', 'name', 'likes', 'genre', 'performer', 'album', 'image', 'audio_file', 'duration')

class PlaylistSerializer(serializers.ModelSerializer):
    musics = MusicSerializer(many=True, read_only=True)
    order = serializers.ListField(child=serializers.IntegerField(), read_only=True)

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'author','musics' ,'order')

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('id', 'playlist', 'music')