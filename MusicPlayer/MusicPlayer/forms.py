from django.contrib.auth.forms import AuthenticationForm
from django import forms

class LoginForm(AuthenticationForm):
    # AuthenticationForm -> Default Login Form
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'id': 'InputUsername1',
            'placeholder': 'Username',
            'aria-describedby': 'usernameHelp',
            'type': 'text'

        })
        self.fields["password"].widget.attrs.update({
            'type': 'password',
            'class': 'form-control',
            'placeholder': 'Password',
            'id': 'InputPassword1'
        })


class MusicSearchForm(forms.Form):
    query = forms.CharField(label="Song Title" ,max_length=50, required=False)
