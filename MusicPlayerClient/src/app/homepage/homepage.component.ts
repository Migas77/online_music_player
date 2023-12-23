import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { NgForOf, NgIf, CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MusicService } from '../music.service';
import { PerformerService } from '../performer.service';
import { Music } from '../models/Music';
import { Performer } from '../models/Performer';
import { PlaybarComponent } from '../playbar/playbar.component';
import { RouterLink } from '@angular/router';
import {Playlist} from "../models/Playlist";
import {PlaylistService} from "../playlist.service";
import {AuthService} from "../auth.service";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, CommonModule, PlaybarComponent, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;
  musicService: MusicService = inject(MusicService);
  performerService: PerformerService = inject(PerformerService);
  playlistService : PlaylistService = inject(PlaylistService)
  authService : AuthService = inject(AuthService)

  searchForm!: FormGroup;
  musicsByGenre: { [key: string] :Music[]} = {};
  allMusics: Music[] = [];
  performers: Performer[] = [];
  searchResult: { [key: string] :Music[]} = {};

  playlists : Playlist[] = [];

  currentMusicName! : string;
  currentMusicId! : number;
  musicAdded: boolean = false;
  musicAddedFailed: boolean = false;

  musicAddedToQueue: boolean = false;
  createPlaylistForm!: FormGroup;

  user: Number = 2;
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {

    this.performerService.getPerformers().then((performers: Performer[]) => {
      this.performers = performers;
    });

    this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
      this.musicsByGenre = musics;
    });

    this.searchForm = this.fb.group({
      searchQuery: ''
    });

    this.createPlaylistForm = this.fb.group({
      name: '',
    });

    if (this.authService.isLoggedIn){
      this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
        this.playlists = playlists;
      })
    }


    this.musicService.getMusics().then((musics: Music[]) => {
      this.allMusics = musics;
    });
  }

  async onSubmit(): Promise<void> {
    this.searchResult = {};
    let query = this.searchForm.value.searchQuery;
    if (query) {
      this.musicsByGenre = {};
      this.searchResult = await this.musicService.searchMusics(query);
    } else {
      this.searchResult = {};
      this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
        this.musicsByGenre = musics;
      });
    }
  }

  getObjectSize(obj: { [key: string] : any}): number {
    return Object.keys(obj).length;
  }

  getCurrentPageItems(): { [key: string] :Music[] } {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const res: { [key: string] :Music[] } = {};

    const allGenres = Object.keys(this.getObjectSize(this.searchResult) > 0 ? this.searchResult : this.musicsByGenre);
    const genres = allGenres.slice(start, end);

    genres.forEach(g => {
      res[g] = this.getObjectSize(this.searchResult) > 0 ? this.searchResult[g] : this.musicsByGenre[g];
    });

    return res;
  }

  getTotalPages(): number {
    return Math.ceil(Object.keys( this.getObjectSize(this.searchResult) > 0 ?  this.searchResult : this.musicsByGenre).length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  prevNextPage(isNext?: boolean): void {
    if (isNext) {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++;
      }
    } else {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }

  getName(performer: Performer): string {
    return this.performerService.getPerformerName(performer, this.performers)
  }

  playSong(song: Music): void {
    this.playbarComponent.playSong(song);
  }

  addMusicToPlaylist(musicId: number, playlistId: number) {
    this.musicAdded = false;
    this.musicAddedFailed = false;
    this.playlistService.addMusicToPlaylist(musicId, playlistId).then((res: any) => {
      if (res.ok) {
        console.log("Music added successfully");
        this.musicAdded = true;
        setTimeout(() => {
          this.musicAdded = false;
        }, 3000);
      } else {
        this.musicAddedFailed = true;
        setTimeout(() => {
          this.musicAddedFailed = false;
        }, 3000);

      }
    });
  }

  async onSubmitCreatePlaylist(): Promise<void>{
    const playlist = this.createPlaylistForm.value
    this.playlistService.createPlaylist(playlist)
      .then((res: Playlist) => {
        this.playlists.push(res)
        document.getElementById("closeAddPlaylistModal")?.click();
      });
  }

  musicLiked(id: number) {
    if (this.allMusics.length > 0)
      return this.allMusics.filter(m => m.id == id)[0].likes.filter(l => l.id == this.authService.userId).length > 0;
    else
      return false;
  }

  likeMusic(id: number) {
    this.musicService.likeMusic(id).then((res) => {
      if (res.ok){
        this.musicService.getMusics().then((musics: Music[]) => {
          this.allMusics = musics;
        });
        this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
          this.musicsByGenre = musics;
        });
        this.onSubmit();
      }
    });
  }

  dislikeMusic(id: number) {
    this.musicService.dislikeMusic(id).then((res) => {
      if (res.ok) {
        this.musicService.getMusics().then((musics: Music[]) => {
          this.allMusics = musics;
        });
        this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
          this.musicsByGenre = musics;
        });
        this.onSubmit();
      }
    });
  }

  addToQueue(id: number) {
    this.musicService.addToQueue(id);
    this.musicAddedToQueue = true;
    setTimeout(() => {
      this.musicAddedToQueue = false;
    }, 3000);
  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
