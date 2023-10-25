from django.contrib.auth.forms import AuthenticationForm


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

