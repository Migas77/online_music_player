from datetime import timedelta
from django.core.validators import FileExtensionValidator
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.db.models import Sum
import magic
from tinytag import TinyTag


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
    followers = models.ManyToManyField('self', verbose_name=_('Followers'))
    objects = ListenerManager()
    email = models.EmailField(unique=True, verbose_name=_("Email"))

    class Meta:
        verbose_name = _('Listener')

    def __str__(self):
        return self.username


class MediaContent(models.Model):
    name = models.CharField(max_length=50, verbose_name=_("Name"), unique=True)
    # will set to timezone.now when instance is created
    duration = models.DurationField(null=True, verbose_name=_("Duration"))

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Performer(models.Model):
    name = models.CharField(max_length=50, verbose_name=_("Name"))
    image = models.ImageField(upload_to='performer', verbose_name=_("Image"))
    description = models.CharField(max_length=10000, verbose_name=_("Description"))

    def __str__(self):
        return self.name


class Artist(Performer):
    def __str__(self):
        return self.name

    pass


class Band(Performer):
    members = models.ManyToManyField(Artist, related_name='bands', verbose_name=_('Members'))

    def __str__(self):
        return self.name


class Album(MediaContent):
    name = models.CharField(max_length=100, verbose_name=_("Name"))
    release_date = models.DateField(verbose_name=_("Date"))
    image = models.ImageField(upload_to='album', verbose_name=_('Image'))
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE, verbose_name=_("Performer"))

    def calculate_duration(self):
        duration_sum = self.songs.aggregate(total_duration=Sum('duration'))['total_duration']
        return duration_sum

    def __str__(self):
        return self.name


class Genre(models.Model):
    title = models.CharField(max_length=15, verbose_name=_("Genre"), unique=True)
    image = models.ImageField(upload_to='genres')

    def __str__(self):
        return self.title


def validate_file_mimetype(file):
    accepted = ["audio/mpeg", "audio/x-wav"]
    file_mime_type = magic.from_buffer(file.read(), mime=True)
    if file_mime_type not in accepted:
        raise ValidationError(f'{file_mime_type} - Unsupported file type')


class Music(MediaContent):
    likes = models.ManyToManyField(Listener)
    genre = models.ForeignKey(Genre, on_delete=models.PROTECT, verbose_name=_("Genre"))
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE, verbose_name=_("Performer"))
    album = models.ForeignKey(Album, on_delete=models.CASCADE, verbose_name=_("Album"), related_name='songs')
    image = models.ImageField(upload_to='music/images', verbose_name=_('Image'))
    audio_file = models.FileField(
        verbose_name=_("Audio File"), upload_to='music/audios',
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav']), validate_file_mimetype]
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        audio_file_path = self.audio_file.path

        audio = TinyTag.get(audio_file_path)
        hours, remainder = divmod(audio.duration, 3600)
        minutes, seconds = divmod(remainder, 60)

        duration_timedelta = timedelta(hours=round(hours),minutes=round(minutes), seconds=round(seconds))

        self.duration = duration_timedelta
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        for playl in self.playlist_set.all():
            playl.order.remove(self.id)
            playl.save()
        super().delete(using, keep_parents)

    @property
    def total_likes(self):
        return self.likes.count()

    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(Listener, on_delete=models.CASCADE)
    musics = models.ManyToManyField(Music, through='Membership')
    order = models.JSONField(default=list)

    def get_memberships(self):
        # I am acessing the through field because I want the relationship attribute added_date
        return [self.musics.through.objects.get(music__id=music_id, playlist=self) for music_id in self.order]

    def change_order(self, prev_pos, next_pos):
        music_id = self.order.pop(prev_pos)
        self.order.insert(next_pos, music_id)
        self.save()

    def __str__(self):
        return self.name


class Membership(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, verbose_name=_('Playlist'))
    music = models.ForeignKey(Music, on_delete=models.CASCADE, verbose_name=_('Music'))
    added_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ["playlist", "music"]

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(force_insert, force_update, using, update_fields)
        self.playlist.order.append(self.music.id)
        self.playlist.save()

    def delete(self, using=None, keep_parents=False):
        self.playlist.order.remove(self.music_id)
        self.playlist.save()
        super().delete(using, keep_parents)
