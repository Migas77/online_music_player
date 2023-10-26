from django.contrib.auth.forms import AuthenticationForm, BaseUserCreationForm
from django import forms
from django.contrib.auth import get_user_model
from .models import Artist, Performer, Music, Album, Playlist, Membership, Band

User = get_user_model()  # custom user model


class LoginForm(AuthenticationForm):
    # AuthenticationForm -> Default Login Form

    class Meta:
        model = User
        fields = ('username', 'password')

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'id': 'InputUsername1',
            'placeholder': 'Username',
            'aria-describedby': 'usernameHelp',
        })
        self.fields["password"].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password',
            'id': 'InputPassword1'
        })


class SignUpForm(BaseUserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields["email"] = forms.EmailField(label='', max_length=40, widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'id': 'InputEmail1',
            'placeholder': 'Email',
            'aria-describedby': 'emailHelp',
        }))
        self.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'id': 'InputUsername1',
            'placeholder': 'Username',
            'aria-describedby': 'usernameHelp',
        })
        self.fields["password1"].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password',
            'id': 'InputPassword1'
        })
        self.fields["password2"].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Confirm Password',
            'id': 'InputPassword2'
        })


class MusicSearchForm(forms.Form):
    query = forms.CharField(label="Song Title", max_length=50, required=False, widget=forms.TextInput(attrs={'class': 'input-secondary', 'placeholder': 'Search for a song'}))

class AddArtistForm(forms.ModelForm):
    class Meta:
        model = Artist
        fields = ['name', 'description', 'image']

class AddMusicForm(forms.ModelForm):
    class Meta:
        model = Music
        fields = ['name', 'genre', 'duration','album','performer','image', 'audio_file']
        widgets = {
            'album': forms.Select(attrs={'class': 'addMusicClass'}),
            'performer': forms.Select(attrs={'class': 'addMusicClass'}),
        }

class AddBandForm(forms.ModelForm):
    class Meta:
        model = Band
        fields = ['name', 'description', 'image', 'members']
        widgets = {
            'members': forms.CheckboxSelectMultiple(attrs={'class': 'addBandClass'}),
        }