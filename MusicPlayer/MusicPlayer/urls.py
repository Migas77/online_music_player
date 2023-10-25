"""MusicPlayer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from MusicPlayer import views
from MusicPlayer.forms import LoginForm, SignUpForm
from django.contrib.auth import views as auth_views
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    # login_signup / logout
    # Tanto aqui como em views.sign_up temos de mandar sempre dois forms
    # porque estão na mesma página
        path('login_signup/', auth_views.LoginView.as_view(
            template_name='login.html', authentication_form=LoginForm, next_page='home',
            extra_context={"SignUpForm": SignUpForm()}
        ), name='login_signup'),
    path('sign_up', views.sign_up, name='signup'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    # others
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('artist/<str:artist_name>/', views.artistInformation, name="artist_info"),
    path('adminPanel/', views.adminPanel, name='adminPanel'),
    path('adminPanel/addArtist/', views.addArtist, name='addArtist'),
    path('adminPanel/addMusic/', views.addMusic, name='addMusic'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
