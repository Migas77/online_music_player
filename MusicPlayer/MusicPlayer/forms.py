from django.contrib.auth.forms import AuthenticationForm, BaseUserCreationForm
from django import forms
from django.contrib.auth import get_user_model

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
