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


class Music(MediaContent):
    # don't need to add more arguments
    pass


class Album(MediaContent):
    musics = models.ManyToManyField(Music)


class Artist(models.Model):
    name = models.CharField(max_length=50)
    isBand = models.BooleanField(default=False)
    musics = models.ManyToManyField(Music)
    albums = models.ManyToManyField(Album)


class Playlist(models.Model):
    author = models.ForeignKey(Listener, on_delete=models.CASCADE)
    musics = models.ManyToManyField(Music, through='Membership')


class Membership(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
    order_id = models.PositiveIntegerField()

    class Meta:
        unique_together = ["playlist", "music", "order_id"]
        ordering = ["order_id"]


