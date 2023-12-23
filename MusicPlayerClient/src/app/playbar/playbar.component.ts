import { Component, ElementRef, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Music } from '../models/Music';
import { Performer } from '../models/Performer';
import { PerformerService } from '../performer.service';
import { MusicService } from '../music.service';
import {PlaylistService} from "../playlist.service";
import {Router} from "@angular/router";
import {BACKEND_URL} from "../consts";

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
  playlistService: PlaylistService = inject(PlaylistService);

  constructor(private elementRef: ElementRef, private router: Router) {

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

  playSong(song: Music): void {
    this.currentSong = song;
    this.currentSongIndex = this.isPlaylist ?  this.playlistMusics.findIndex(song1 => song1.id === song.id) : this.isAlbum ? this.albumsMusics.indexOf(song) : this.isArtist ? this.artistsMusics.indexOf(song) : this.allMusics.indexOf(song);
    this.audioElement.src = BACKEND_URL + song.audio_file;
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

  async playPlaylist(playlistId: number, song?: Music): Promise<void> {
    this.playlistMusics = []
    await this.playlistService.getPlaylist(String(playlistId)).then((playlist) => {
      this.playlistMusics = playlist.musics.sort((a: Music, b: Music) => {
        return playlist.order.indexOf(a.id) - playlist.order.indexOf(b.id);
      });
    });
    this.isPlaylist = true;
    console.log("PLAYLIST PLAYLIST: ", this.playlistMusics);
    if (song) {
      this.playSong(song);
    } else {
      this.playSong(this.playlistMusics[0]);
    }
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
    else {
      this.currentSongIndex = 0;
      this.playSong(this.isPlaylist ? this.playlistMusics[this.currentSongIndex] : this.isAlbum ? this.albumsMusics[this.currentSongIndex] : this.isArtist ? this.artistsMusics[this.currentSongIndex] : this.allMusics[this.currentSongIndex]);
    }
  }

  togglePlay(): void {
    if (this.currentSong === null) {
      if (this.router.url === "/") {
        this.playSong(this.allMusics[0]);
      } else if (this.router.url.startsWith("/playlist")) {
        const playlistId = this.router.url.split("/")[2];
        this.playPlaylist(Number(playlistId));
      } else if (this.router.url.startsWith("/artistDetails")) {
        const performerId = this.router.url.split("/")[2];
        this.playArtist(Number(performerId));
      }
    } else if (this.audioElement.paused) {
      this.audioElement.play();
      this.isPlaying = true;
    } else {
      this.audioElement.pause();
      this.isPlaying = false;
    }
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
