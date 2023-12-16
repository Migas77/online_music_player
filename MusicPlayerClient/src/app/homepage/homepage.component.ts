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

  searchForm!: FormGroup;
  musicsByGenre: { [key: string] :Music[]} = {};
  allMusics!: Music[];
  performers: Performer[] = [];
  searchResult: { [key: string] :Music[]} = {};

  playlists : Playlist[] = [];
  playlistService : PlaylistService = inject(PlaylistService)
  currentMusicName! : string;
  currentMusicId! : number;
  musicAdded: boolean = false;
  musicAddedFailed: boolean = false;

  createPlaylistForm!: FormGroup;

  user: Number = 2;

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
      author: '',
      musics: '',
    });

    this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
      this.playlists = playlists;
    })

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

  getName(performer: Performer): string {
    return this.performerService.getPerformerName(performer, this.performers)
  }

  playSong(song: Music): void {
    this.playbarComponent.playSong(song);
  }

  getObjectSize(obj: { [key: string] : any}): number {
    return Object.keys(obj).length;
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
    const playlist = this.createPlaylistForm.value;
    playlist.author = "2"
    this.playlistService.createPlaylist(playlist).then((res: any) => {
      if (res.ok) {
        console.log("Playlist created successfully");
        document.getElementById("closeAddPlaylistModal")?.click();
        this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
          this.playlists = playlists;
        })
      }
    });
  }

  musicLiked(id: number) {
    return this.allMusics.filter(m => m.id == id)[0].likes.filter(l => l.id == Number(this.user)).length > 0;
  }

  likeMusic(id: number) {
    this.musicService.likeMusic(id, Number(this.user)).then((res) => {
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
    this.musicService.dislikeMusic(id, Number(this.user)).then((res) => {
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

}
