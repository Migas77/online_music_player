from django.db import models
from django.contrib.auth.models import AbstractUser  # User model from django


class Listener(AbstractUser):
    followers = models.ManyToManyField('self')

class MediaContent(models.Model):
    name = models.CharField(max_length=50)
    release_date = models.DateTimeField(auto_now_add=True)
    # will set to timezone.now when instance is created
    likes = models.IntegerField(default=0)
    duration = models.DurationField()
    # non mandatory field
    followers = models.ManyToManyField(Listener, blank=True)

    class Meta:
        unique_together = ['name', 'release_date']
        abstract = True


class Artist(models.Model):
    name = models.CharField(max_length=50)
    isBand = models.BooleanField(default=False)

class Album(MediaContent):
    name = models.CharField(max_length=100)
    release_date = models.DateField()
    image = models.ImageField(null=True)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, null=True)


class Music(MediaContent):
    # don't need to add more arguments
    genre = models.CharField(max_length=50, null=True)
    artist = models.ManyToManyField(Artist)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True)
    image = models.ImageField(null=True)
    audio_file = models.FileField(blank=True, null=True)


class Playlist(models.Model):
    name = models.CharField(max_length=50, null=True)
    author = models.ForeignKey(Listener, on_delete=models.CASCADE, null=True)
    musics = models.ManyToManyField(Music, through='Membership')


class Membership(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, null=True)
    music = models.ForeignKey(Music, on_delete=models.CASCADE, null=True)
    order_id = models.PositiveIntegerField()

    class Meta:
        unique_together = ["playlist", "music", "order_id"]
        ordering = ["order_id"]


