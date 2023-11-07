let audioElement = new Audio();
let songIndex = 0;
let ProgressBar = document.getElementById('ProgressBar');
console.log("PROGRESS BAR: " + ProgressBar);
ProgressBar.value = 0;
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let masterPlay = document.getElementById('masterPlay');

let songItems = Array.from(document.getElementsByClassName('songitem_tp'));

let playButtons = Array.from(document.getElementsByClassName('songItemPlay'));

const albumCards = document.querySelectorAll('.album-card');

const albumData = {};

masterPlay.addEventListener('click', togglePlay);

function getAlbumsInfo() {
    albumCards.forEach((albumCard) => {
        const albumId = albumCard.classList[1].replace('album-', '');
        const songs = [];
    
        const songItems = albumCard.querySelectorAll(`.songitem-${albumId}`);
    
        songItems.forEach((songItem) => {
            const songName = songItem.querySelector('.songName strong').textContent;
            const audioUrl = songItem.querySelector('.songItemPlay').getAttribute('data-song-url');
    
            const song = {
                songName: songName,
                audioUrl: audioUrl,
            };
    
            songs.push(song);
        });
    
        albumData[albumId] = songs;
    });
}


function getAllSongs() {
    const songs = [];
    for (const albumId in albumData) {
        songs.push(...albumData[albumId]);
    }
    return songs;
}

const albuns = getAlbumsInfo();
const songs = getAllSongs();

albumCards.forEach((albumCard) => {
    console.log("ALBUM CARD: " + albumCard);
    console.log("Album SONGS: " + albumData[albumCard.id]);
});

// Play songs from a specific album
function togglePlayAlbum(album_id) {
    if (audioElement.paused || audioElement.currentTime <= 0) {

        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        masterSongName.innerText = albumData[album_id][songIndex]

        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex + 1) % albumData[album_id].length;
            audioElement.src = albumData[album_id][songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = albumData[album_id][songIndex].songName;
            togglePlay();
        });
        
        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex - 1 + albumData[album_id].length) % songs.length;
            audioElement.src = albumData[album_id][songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = albumData[album_id][songIndex].songName;
            togglePlay();
        });
        
        ProgressBar.addEventListener('input', () => {
            const seekTime = (ProgressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });

    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;

        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex + 1) % albumData[album_id][songIndex].length;
            audioElement.src = albumData[album_id][songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = albumData[album_id][songIndex].songName;
            togglePlay();
        });
        
        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex - 1 + albumData.get(album_id).length) % albuns.get(album_id).length;
            audioElement.src = albumData[album_id][songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = albumData[album_id][songIndex].songName;
            togglePlay();
        });
        
        ProgressBar.addEventListener('input', () => {
            const seekTime = (ProgressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });
    }
}

// Play a song from all the artists songs
function togglePlay() {
    if (audioElement.paused || audioElement.currentTime <= 0) {

        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        masterSongName.innerText = songs[songIndex].audioUrl;

        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex + 1) % songs.length;
            audioElement.src = songs[songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = songs[songIndex].songName;
            togglePlay();
        });
        
        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex - 1 + songs.length) % songs.length;
            audioElement.src = songs[songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = songs[songIndex].songName;
            togglePlay();
        });
        
        ProgressBar.addEventListener('input', () => {
            const seekTime = (ProgressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });

    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;

        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            ProgressBar.value = progress;
        });
        
        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex + 1) % songs.length;
            audioElement.src = songs[songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = songs[songIndex].songName;
            togglePlay();
        });
        
        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex - 1 + songs.length) % songs.length;
            audioElement.src = songs[songIndex].audioUrl;
            audioElement.currentTime = 0;
            masterSongName.innerText = songs[songIndex].songName;
            togglePlay();
        });
        
        ProgressBar.addEventListener('input', () => {
            const seekTime = (ProgressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });
    }
}



