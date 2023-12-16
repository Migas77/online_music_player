import { Component, ElementRef, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Music } from '../models/Music';
import { Performer } from '../models/Performer';
import { PerformerService } from '../performer.service';
import { MusicService } from '../music.service';
import { Playlist } from "../models/Playlist";

@Component({
  selector: 'app-playbar',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './playbar.component.html',
  styleUrl: './playbar.component.css'
})
export class PlaybarComponent {
 
  currentSongIndex: number | null = null;
  currentSong: Music | null = null;

  audioElement!: HTMLAudioElement;
  
  performers: Performer[] = [];
  playlistMusics: Music[] = [];
  albumsMusics: Music[] = [];
  artistsMusics: Music[] = [];
  allMusics: Music[] = [];

  isPlaylist: boolean = false;
  isAlbum: boolean = false;
  isArtist: boolean = false;
  isPlaying: boolean = false;

  musicService: MusicService = inject(MusicService);
  performerService: PerformerService = inject(PerformerService);

  constructor(private elementRef: ElementRef) {

    this.musicService.getMusics().then((m: Music[]) => {
      this.allMusics = m;
    });

    this.performerService.getPerformers().then((performers: Performer[]) => {
      this.performers = performers;
    });

    this.audioElement = new Audio();
    this.audioElement.addEventListener('timeupdate', () => {
      const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
      this.elementRef.nativeElement.querySelector('#ProgressBar').value = progress;
    });

    this.audioElement.addEventListener('ended', () => {
      this.updateSongInfo();
    });
  }

  playSong(song: Music, playlist?:Playlist): void {
    if (playlist) {
      this.isPlaylist = true;
      this.playlistMusics = playlist.musics;
    } else {
      this.isPlaylist = false;
      this.playlistMusics = [];
    }
    this.currentSong = song;
    this.currentSongIndex = this.isPlaylist ? this.playlistMusics.indexOf(song) : this.isAlbum ? this.albumsMusics.indexOf(song) : this.isArtist ? this.artistsMusics.indexOf(song) : this.allMusics.indexOf(song);
    this.audioElement.src = 'http://localhost:8000/' + song.audio_file;
    this.audioElement.currentTime = 0;
    this.isPlaying = true;
    this.audioElement.load();
    this.audioElement.play()
      .then(() => {
        this.elementRef.nativeElement.querySelector('#masterSongName').innerText = this.performerService.getPerformerName(song.performer, this.performers) + ' - ' +  song.name;
      })
      .catch(error => {
        console.log('Error playing audio:', error);
      });
  }

  async playAlbum(albumId: number): Promise<void> {
    this.albumsMusics = []
    const songs = await this.musicService.getMusicsByAlbum(albumId);
    console.log("SONGS: ", songs);
    this.isAlbum = true;
    this.albumsMusics = songs;
    console.log("PLAYLIST ALBUM: ", this.albumsMusics);
    this.playSong(this.albumsMusics[0]);
  }
   
  async playArtist(performerId: number): Promise<void> {
    this.artistsMusics = []
    const songs = await this.musicService.getMusicsByPerformer(performerId);
    this.isArtist = true;
    this.artistsMusics = songs;
    console.log("PLAYLIST ARTIST: ", this.artistsMusics);
    this.playSong(this.artistsMusics[0]);
  }

  previousSong(): void {
    if (this.currentSongIndex !== null && this.currentSongIndex > 0) {
      this.currentSongIndex--;
      this.playSong(this.isPlaylist ? this.playlistMusics[this.currentSongIndex] : this.isAlbum ? this.albumsMusics[this.currentSongIndex] : this.isArtist ? this.artistsMusics[this.currentSongIndex] : this.allMusics[this.currentSongIndex]);
    }
  }

  nextSong(): void {
    if (this.currentSongIndex !== null && this.currentSongIndex < (this.isPlaylist ? this.playlistMusics.length - 1 : this.isAlbum ? this.albumsMusics.length - 1 : this.isArtist ? this.artistsMusics.length - 1 : this.allMusics.length - 1)) {
      this.currentSongIndex++;
      this.playSong(this.isPlaylist ? this.playlistMusics[this.currentSongIndex] : this.isAlbum ? this.albumsMusics[this.currentSongIndex] : this.isArtist ? this.artistsMusics[this.currentSongIndex] : this.allMusics[this.currentSongIndex]);
    }
  }

  togglePlay(): void {
    if (this.audioElement.paused) {
      this.audioElement.play();
      this.isPlaying = true;
    } else {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  getName(performer: Performer): string {
    return this.performerService.getPerformerName(performer, this.performers)
  }

  seekTo(event: any): void {
    const time = (event.target.value / 100) * this.audioElement.duration;
    this.audioElement.currentTime = time;
  }

  updateSongInfo(): void {
    if (this.currentSong) {
      this.elementRef.nativeElement.querySelector('#masterSongName').innerText = this.currentSong.name + " - " + this.performerService.getPerformerName(this.currentSong.performer, this.performers);
      this.isPlaying = false;
    }
  }
}
