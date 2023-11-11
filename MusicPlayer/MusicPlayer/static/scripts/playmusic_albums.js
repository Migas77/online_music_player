const audioPlayer = new Audio();
let currentPlaylist = [];
let currentSongIndex = 0;
let gif = document.getElementById('gif');
let songPerformer = document.getElementsByClassName('songPerformer')[0].innerText;

document.getElementById('masterPlay').addEventListener('click', togglePlayPause);
document.getElementById('ProgressBar').addEventListener('click', seekToTime);
audioPlayer.addEventListener('play', updatePlayIcon);
audioPlayer.addEventListener('pause', updatePlayIcon);

audioPlayer.addEventListener('timeupdate', () => {
    const progressBar = document.getElementById('ProgressBar');
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
});

function playSong() {
    if (currentPlaylist.length > 0) {
        if (currentSongIndex < currentPlaylist.length) {
            audioPlayer.src = currentPlaylist[currentSongIndex].src;
            audioPlayer.play();
            gif.style.opacity = 1;
            document.getElementById('masterSongName').textContent = songPerformer + " - " + currentPlaylist[currentSongIndex].songName;
        } else {
            audioPlayer.pause();
        }
    }
}

function togglePlay(artistId) {
    currentPlaylist = shuffleSongsForArtist(artistId);
    currentSongIndex = 0;
    playSong();
}

function togglePlayAlbum(albumId) {
    currentPlaylist = shuffleSongsForAlbum(albumId);
    currentSongIndex = 0;
    playSong();
}

function playSpecificSong(songUrl, songName) {
    const currentAlbumId = getCurrentAlbumId(songUrl);
    currentPlaylist = shuffleSongsForAlbum(currentAlbumId, songUrl);
    currentSongIndex = 0;
    playSong();
}

function getCurrentAlbumId(songUrl) {
    const songElement = document.querySelector(`[data-song-url="${songUrl}"]`);
    const albumId = songElement.dataset.albumId;
    return albumId;
}

function shuffleSongsForArtist(artistId) {
    const songs = document.querySelectorAll(`.songitem-${artistId}`);
    return shuffleArray(Array.from(songs).map((song) => ({
        src: song.querySelector('.songItemPlay').getAttribute('data-song-url'),
        songName: song.querySelector('.songName').textContent,
    })));
}

function shuffleSongsForAlbum(albumId) {
    const songs = document.querySelectorAll(`.songitem-${albumId}`);
    return shuffleArray(Array.from(songs).map((song) => ({
        src: song.querySelector('.songItemPlay').getAttribute('data-song-url'),
        songName: song.querySelector('.songName strong').textContent,
    })));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
        gif.style.opacity = 0;
    }
    updatePlayIcon();
}

function seekToTime(event) {
    const progressBar = document.getElementById('ProgressBar');
    const seekTime = (event.offsetX / progressBar.clientWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}

function updatePlayIcon() {
    const playIcon = document.getElementById('masterPlay');
    if (audioPlayer.paused) {
        playIcon.classList.remove('fa-pause-circle');
        playIcon.classList.add('fa-play-circle');
    } else {
        playIcon.classList.remove('fa-play-circle');
        playIcon.classList.add('fa-pause-circle');
    }
}

document.getElementById('previous').addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        playSong();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentSongIndex < currentPlaylist.length - 1) {
        currentSongIndex++;
        playSong();
    }
});

