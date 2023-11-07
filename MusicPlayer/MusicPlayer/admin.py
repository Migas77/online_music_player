from django.contrib import admin
from MusicPlayer.models import *

admin.site.register(Listener)
# MediaContent is abstract so it will not be registered
admin.site.register(Music)
admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Band)
admin.site.register(Genre)
admin.site.register(Playlist)
admin.site.register(Membership)



