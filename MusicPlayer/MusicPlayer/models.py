from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models import Count
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
    followers = models.ManyToManyField('self', verbose_name=_('Followers'))
    objects = ListenerManager()
    email = models.EmailField(blank=True, unique=True, verbose_name=_("Email"))

    class Meta:
        verbose_name = _('Listener')

    def __str__(self):
        return self.username


class MediaContent(models.Model):
    name = models.CharField(max_length=50, verbose_name=_("Name"))
    release_date = models.DateTimeField(auto_now_add=True, verbose_name=_("Release Date"))
    # will set to timezone.now when instance is created
    duration = models.DurationField(null=True, verbose_name=_("Duration"))
    # non mandatory field
    followers = models.ManyToManyField(Listener, blank=True, verbose_name=_("Followers"))

    class Meta:
        unique_together = ['name', 'release_date']
        abstract = True

    def __str__(self):
        return self.name


class Performer(models.Model):
    name = models.CharField(max_length=50, verbose_name=_("Name"))
    image = models.ImageField(upload_to='performer', verbose_name=_("Image"))
    description = models.CharField(max_length=10000, blank=True, verbose_name=_("Description"))

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
    image = models.ImageField(null=True, upload_to='album', verbose_name=_('Image'))
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE, verbose_name=_("Performer"))

    def __str__(self):
        return self.name


class Music(MediaContent):
    genre = models.CharField(max_length=50, verbose_name=_("Genre"))
    performer = models.ForeignKey(Performer, on_delete=models.CASCADE, verbose_name=_("Performer"))
    album = models.ForeignKey(Album, on_delete=models.CASCADE, blank=True, verbose_name=_("Album"))
    image = models.ImageField(upload_to='music', verbose_name=_('Image'))
    audio_file = models.FileField(verbose_name=_("Audio File"))

    @property
    def total_likes(self):
        return Like.objects.filter(music=self).count()

    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(Listener, on_delete=models.CASCADE)
    musics = models.ManyToManyField(Music, through='Membership')
    order = models.JSONField(default=[])

    def get_musics(self):
        musics = self.musics.all()
        return [musics.get(id=music_id) for music_id in self.order]

    def change_order(self, prev_pos, next_pos):
        music_id = self.order.pop(prev_pos)
        self.order.insert(next_pos, music_id)
        self.save()

    def __str__(self):
        return self.name


class Like(models.Model):
    user = models.ForeignKey(Listener, on_delete=models.CASCADE, verbose_name=_('User'))
    music = models.ForeignKey(Music, on_delete=models.CASCADE, related_name="likes", verbose_name=_('Likes'))


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
        print(self.playlist.order)

    def delete(self, using=None, keep_parents=False):
        self.playlist.order.remove(self.music_id)
        self.playlist.save()
        print(self.playlist.order)
        super().delete(using, keep_parents)
