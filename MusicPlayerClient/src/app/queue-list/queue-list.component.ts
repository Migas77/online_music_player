import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {Music} from "../models/Music";
import {PlaybarComponent} from "../playbar/playbar.component";
import {PerformerService} from "../performer.service";
import {Performer} from "../models/Performer";
import {GenreService} from "../genre.service";
import {Genre} from "../models/Genre";
import {MusicService} from "../music.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AuthService} from "../auth.service";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-queue-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CdkDrag,
    CdkDropList,
    NgForOf,
    NgIf,
    PlaybarComponent,
    RouterLink
  ],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.css'
})
export class QueueListComponent {

  authService : AuthService = inject(AuthService);

  currentMusicName!: string;
  currentMusicId!: number;
  musics: Music[] = [];

  performerService: PerformerService = inject(PerformerService);
  performers: Performer[] = [];

  genreService: GenreService = inject(GenreService);
  genres: Genre[] = [];

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private musicService: MusicService, private route: ActivatedRoute) {
    this.musicService.getQueue().then((musics) => {
      this.musics = musics;
    });

    this.performerService.getPerformers().then((performers) => {
      this.performers = performers;
    });

    this.genreService.getGenres().then((genres) => {
      this.genres = genres;
    });
  }

  playSong(song: Music) {
    this.playbarComponent.playSong(song);
  }

  musicLiked(id: number) {
    return this.musics.filter(m => m.id == id)[0].likes.filter(l => l.id == this.authService.userId).length > 0;
  }

  likeMusic(id: number) {
    this.musicService.likeMusic(id).then((res) => {
      if (res.ok) {
        this.musicService.getQueue().then((musics) => {
          this.musics = musics;
        });
      }
    });
  }

  dislikeMusic(id: number) {
    this.musicService.dislikeMusic(id).then((res) => {
      if (res.ok) {
        this.musicService.getQueue().then((musics) => {
          this.musics = musics;
        });
      }
    });
  }

  getPerformerName(performer: Performer) {
    return this.performerService.getPerformerName(performer, this.performers);
  }

  getGenreTitle(genre: Genre) {
    return this.genreService.getGenreTitle(genre, this.genres);
  }

  async removeSong() {
    await this.musicService.removeQueueSong(this.currentMusicId);
    document.getElementById("closeModal")?.click();
    this.musicService.getQueue().then((musics) => {
      this.musics = musics;
    });
  }

  async clearQueue() {
    await this.musicService.clearQueue();
    this.musicService.getQueue().then((musics) => {
      this.musics = musics;
    });

  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
