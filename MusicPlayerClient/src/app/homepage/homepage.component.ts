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
  allMusics: Music[] = [];
  performers: Performer[] = [];
  searchResult: { [key: string] :Music[]} = {};

  playlists : Playlist[] = [];
  playlistService : PlaylistService = inject(PlaylistService)
  currentMusicName! : string;
  currentMusicId! : number;

  createPlaylistForm!: FormGroup;

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
      name: ''
    });

    this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
      this.playlists = playlists;
      // console.log(this.playlists)
    })
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
    this.playlistService.addMusicToPlaylist(musicId, playlistId).then((res: any) => {
      if (res.ok) {
        console.log("Music added successfully");
        document.getElementById("closeModal")?.click();
      }
    });
  }

  async onSubmitCreatePlaylist(): Promise<void>{
    const playlist = this.createPlaylistForm.value;
    this.playlistService.createPlaylist(playlist).then((res: any) => {
      if (res.ok) {
        console.log("Playlist created successfully");
        document.getElementById("closeModal")?.click();
        this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
          this.playlists = playlists;
          // console.log(this.playlists)
        })
      }
    });

  }
}
