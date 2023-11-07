
// Define global variables to manage audio playback
const audioPlayer = new Audio();
let currentPlaylist = [];
let currentSongIndex = 0;
let gif = document.getElementById('gif');

// Add event listeners for play/pause, seeking, and updating the play icon
document.getElementById('masterPlay').addEventListener('click', togglePlayPause);
document.getElementById('ProgressBar').addEventListener('click', seekToTime);
audioPlayer.addEventListener('play', updatePlayIcon);
audioPlayer.addEventListener('pause', updatePlayIcon);

// Add event listener to update the progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progressBar = document.getElementById('ProgressBar');
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
});

// Function to play a song from the current playlist
function playSong() {
    if (currentPlaylist.length > 0) {
        if (currentSongIndex < currentPlaylist.length) {
            audioPlayer.src = currentPlaylist[currentSongIndex].src;
            audioPlayer.play();
            gif.style.opacity = 1;
            document.getElementById('masterSongName').textContent = currentPlaylist[currentSongIndex].songName;
        } else {
            audioPlayer.pause();
        }
    }
}

// Function to handle the "Listen" button for the artist
function togglePlay(artistId) {
    console.log("ENTERED TOGGLE PLAY FROM ARTIST NAME BUTTON" + artistId);
    // Create a shuffled playlist of songs for the artist
    currentPlaylist = shuffleSongsForArtist(artistId);
    currentSongIndex = 0;
    playSong();
}

// Function to handle the "Listen" button for an album
function togglePlayAlbum(albumId) {
    console.log("ENTERED TOGGLE PLAY FROM ALBUM NAME BUTTON" + albumId);
    // Create a shuffled playlist of songs for the album
    currentPlaylist = shuffleSongsForAlbum(albumId);
    currentSongIndex = 0;
    playSong();
}

// Function to play a specific song
function playSpecificSong(songUrl, songName) {
    console.log("ENTERED PLAY SPECIFIC SONG FUNCTION SONG URL: " + songUrl + " , SONGNAME " + songName);
    // Create a playlist with the selected song and all subsequent songs from the same album
    const currentAlbumId = getCurrentAlbumId(songUrl);
    currentPlaylist = shuffleSongsForAlbum(currentAlbumId, songUrl);
    currentSongIndex = 0;
    playSong();
}

function getCurrentAlbumId(songUrl) {
    // Find the song URL element with the matching data-song-url attribute
    const songElement = document.querySelector(`[data-song-url="${songUrl}"]`);
    // Extract the album ID from the data-album-id attribute
    const albumId = songElement.dataset.albumId;
    return albumId;
}

// Function to shuffle songs for the artist
function shuffleSongsForArtist(artistId) {
    const songs = document.querySelectorAll(`.songitem-${artistId}`);
    return shuffleArray(Array.from(songs).map((song) => ({
        src: song.querySelector('.songItemPlay').getAttribute('data-song-url'),
        songName: song.querySelector('.songName').textContent,
    })));
}

// Function to shuffle songs for an album
function shuffleSongsForAlbum(albumId) {
    const songs = document.querySelectorAll(`.songitem-${albumId}`);
    return shuffleArray(Array.from(songs).map((song) => ({
        src: song.querySelector('.songItemPlay').getAttribute('data-song-url'),
        songName: song.querySelector('.songName strong').textContent,
    })));
}

// Function to shuffle an array
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

// Function to seek to a specific time in the song
function seekToTime(event) {
    const progressBar = document.getElementById('ProgressBar');
    const seekTime = (event.offsetX / progressBar.clientWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}

// Function to update the play icon based on playback status
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

// Event listeners for controlling playback
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

