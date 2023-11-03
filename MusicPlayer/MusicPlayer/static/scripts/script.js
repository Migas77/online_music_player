console.log("Welcome to Music Streaming!");

// Inicialize as variáveis
let audioElement = new Audio();
let songIndex = 0;
let ProgressBar = document.getElementById('ProgressBar');
ProgressBar.value = 0;
let gif = document.getElementById('gif');
let masterPlay = document.getElementById('masterPlay');
let songItems = Array.from(document.getElementsByClassName('songitem_tp'));
let playButtons = Array.from(document.getElementsByClassName('songItemPlay'));

console.log("songItems: " + songItems);
console.log("playButtons: " + playButtons);
console.log("masterPlay: " + masterPlay);
console.log("ProgressBar: " + ProgressBar);

// Add event listener to masterPlay button
masterPlay.addEventListener('click', togglePlay);

function getSongInfo() {
    // Get all song items
    let songItems = Array.from(document.getElementsByClassName('songitem_tp'));
    if (songItems.length === 0) {
        songItems = Array.from(document.getElementsByClassName('songitemPlaylist'));
    }

    // Initialize an empty array to store the song info
    let songs = [];

    // Loop through each song item
    songItems.forEach((item) => {
        // Get the song name, performer, and audio URL
        let songName = item.getElementsByClassName('songName')[0].innerText;
        let performer = item.getElementsByClassName('songPerformer')[0].innerText;
        let audioUrl = item.getElementsByClassName('songItemPlay')[0].getAttribute('data-song-url');
        let coverPath = item.getElementsByTagName('img')[0].src;
        console.log("song name: " + songName);
        // Create a song info object
        let songInfo = {
            songName: songName + ' - ' + performer,
            audioUrl: audioUrl,
            coverPath: coverPath
        };

        // Add the song info object to the array
        songs.push(songInfo);
    });

    // Return the array of song info
    return songs;
}

const songs = getSongInfo();

songs.forEach((music, index) => {
    console.log('Song Name: ' + music.songName);
    console.log('File Path: ' + music.audioPath);
    console.log('Cover Path: ' + music.coverPath);
});

playButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        songIndex = index; // Atualiza o índice da música
        console.log('Song Index: ' + songIndex);
        console.log('songs: ',  songs)
        audioElement.src = songs[songIndex].audioUrl;
        audioElement.currentTime = 0;
        togglePlay();
    });
});

function togglePlay() {
    if (audioElement.paused || audioElement.currentTime <= 0) {

        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        masterSongName.innerText = songs[songIndex].songName;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
}

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

