# online_music_player
TP1 TPW

### Setup
```bash
# clone repo 
git clone git@github.com:Migas77/online_music_player.git
# go inside project 
cd MusicPlayer/
# create venv
python3 -m venv venv
# go inside the venv
source venv/bin/activate
# install requirements
pip install -r requirements.txt
# setup database
python3 manage.py makemigrations MusicPlayer
python3 manage.py migrate
# create superuser if you want to
python3 manage.py createsuperuser
# run
python3 manage.py runserver
```

### Nota:
  - Se tiverem problemas com a BD eliminem no vosso repo local a pasta das migrations, pychache e o ficheiro db.sqlite3
  - Depois voltem a fazer o setup da database

### TODO
  - Se calhar pensar em usar AbstractAdmin (não sei se será necessário)
  - 404 page
  - filters
  - optional parameters
  - Fazer translations
  - Fazer cache
  - Definir uniques depois e colocar catches de IntegirtyError nos forms de Add e Edit
  - Aggregates (xD)
  - Ordering of playlist
    - Ordering not working
    - unique_together = ["playlist", "music", "order_id"] ()