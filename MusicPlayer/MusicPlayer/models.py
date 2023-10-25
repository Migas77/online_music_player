from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class ListenerManager(BaseUserManager):
    def create_user(self, email, username, password):
        if not email:
            raise ValueError('Email is required!')
        if not username:
            raise ValueError('Username is required!')

        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.save()
        return user


# Custom User
class Listener(AbstractUser):
    followers = models.ManyToManyField('self')
    objects = ListenerManager()
    email = models.EmailField(_("email address"), blank=True, unique=True)

    class Meta:
        verbose_name = 'Listener'


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


class Performer(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(blank=True)
    description = models.CharField(max_length=10000, blank=True)


class Artist(Performer):
    pass


class Band(Performer):
    members = models.ManyToManyField(Artist, related_name='bands')


class Album(MediaContent):
    name = models.CharField(max_length=100)
    release_date = models.DateField()
    image = models.ImageField(null=True)
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE)


class Music(MediaContent):
    genre = models.CharField(max_length=50)
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, blank=True)
    image = models.ImageField()
    audio_file = models.FileField()


class Playlist(models.Model):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(Listener, on_delete=models.CASCADE)
    musics = models.ManyToManyField(Music, through='Membership')


class Membership(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
    order_id = models.PositiveIntegerField()

    class Meta:
        unique_together = ["playlist", "music", "order_id"]
        ordering = ["order_id"]
