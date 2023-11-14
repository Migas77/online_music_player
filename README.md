# online_music_player
TP1 TPW

### Setup
```bash
# clone repo 
git clone git@github.com:Migas77/online_music_player.git
# go inside project 
cd MusicPlayer/
# for translation to work in ubuntu (I don't know about MAC)
sudo apt-get install gettext
# create venv
python3 -m venv venv
# go inside the venv
source venv/bin/activate
# install requirements
pip install -r requirements.txt
# compile translations
django-admin compilemessages
# setup database
python3 manage.py makemigrations MusicPlayer
python3 manage.py migrate
# create superuser if you want to
python3 manage.py createsuperuser
# run
python3 manage.py runserver
```

### Features
- Online Music Player
- Permite tocar músicas
- Página com músicas agrupadas por géneros musicais
- Páginas de artistas/bandas
- Página de playlist e ordenação de músicas dentro da playlist
- Página de músicas adicionadas a uma queue
- Likes em músicas
- AdminPage para adicionar, editar e remover Músicas, Géneros de Músicas, Albuns, Artistas e Bandas

### Detalhes da Implementação a destacar
  - **models.py**
    - Criação de um user custom (Listener) e de um manager correspondente (ListenerManager) com implementação de métodos create_user e create_super_user (permite criação de um superuser via command line);
    - Utilização de models abstratos (Media Content) e herança;
    - Definição de unique and unique_together para prevenir registos duplicados;
    - No model Album utilização de queries de agregação para somar as durações de todas as músicas de um álbum (que corresponderá então à duração do album);
    - Função de validação que verifica memtype dos files correspondentes às músicas e sua utilização nos validators do atributo audio_file do model Music;
    - No model Music utilização de models.PROTECT na foreign key genre para prevenir eliminar géneros que têm músicas atribuídas;
    - No model Music faz-se override das funções de save() e delete() para atingir objetivos como calcular a duração de uma música e ordenar as músicas numa playlist;
    - No model Playlist utilização de um through model para guardar atributos da relação (data de adição de cada música à playlist);
    - No model Playlist utilização de um Json Field e overriding das funções de save() e delete() no model Membership para mudar e guardar a ordem das músicas em uma playlist;
  - **views.py**
    - Lookups complexas com Q objects - neste caso permite a search de músicas pelo seu nome, o seu género, o seu artista/banda ou o seu album; 
    - Utilização de endpoints para chamar views que fazem processamento sem a necessidade de dar reload à página (através de POST's AJAX);
    - Agrupamento de musicas por género (songs_by_genre);
    - Utilização de um Paginator(Django) para dar display de apenas músicas de 5 géneros por página;
    - Utilização do annotate para anotar músicas gostadas pelo utilizador;
    - Utilização de login required para impedir o acesso de utilizadores não autenticados;
    - Utilização de django sessions para guardar músicas em uma queue;
  - **forms.py**
    - Herança de forms do django (AuthenticationForm, BaseUserCreationForm) e costumização dos fields do form e classes css
  - **Geral**
    - Tradução para português é efetuada caso o browser esteja em portugûes (file locale/PT/LC_MESSAGES/django.po contém as traduções) - processo de tradução inclui template tags ({% translate 'text'}) nos templates e a utilização de gettext_lazy no código python;
      - Tradução feita em texto, placeholders e erros
    - Admin Page que permite adicionar, editar e eliminar Músicas, Géneros de Músicas, Albuns, Artistas e Bandas (Reutilização de Páginas para Adicionar e Editar verificando se existe ou não uma instância no form - {% if form.instance.id %});


### Relativamente ao Python Anywhere
- A versão que está no python anywhere difere da versão entregue em apenas uma feature. A versão entregue não permite criação de músicas duplicadas e essa é a versão que queremos que seja avaliada. De resto a versão no python anywhere e a entregue coincidem em todos os outros elementos podendo para todas as outras features guiar-se por lá se desejar.
- Credenciais admin (apenas necessário username e password para login)
  - email: admin@gmail.com
  - username: admin
  - password : ADMINtpw12.
  - ('.' incluído na password)

### [Link Github](https://github.com/Migas77/online_music_player)

### Autores 
- Diana Miranda (107457)
- José Gameiro (108840)
- Miguel Figueiredo (108287)
