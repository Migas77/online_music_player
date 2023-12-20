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
import {ActivatedRoute} from "@angular/router";

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
    PlaybarComponent
  ],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.css'
})
export class QueueListComponent {

  currentMusicName!: string;
  currentMusicId!: number;
  musics!: Music[];

  id!: string | null;

  performerService: PerformerService = inject(PerformerService);
  performers!: Performer[];

  genreService: GenreService = inject(GenreService);
  genres!: Genre[];

  user:String = "2"

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private musicService: MusicService,  private route: ActivatedRoute) {
    this.musicService.getQueue().then((musics) => {
      this.musics = musics;
    });
  }

  playSong(song: Music) {
    this.playbarComponent.playSong(song);
  }

  musicLiked(id: number) {
    return this.musics.filter(m => m.id == id)[0].likes.filter(l => l.id == Number(this.user)).length > 0;
  }

  likeMusic(id: number) {
    this.musicService.likeMusic(id, Number(this.user)).then((res) => {
      if (res.ok){
        if (this.id != null) {
          this.musicService.getQueue().then((musics) => {
            this.musics = musics;
          });
        }
      }
    });
  }

  dislikeMusic(id: number) {
    this.musicService.dislikeMusic(id, Number(this.user)).then((res) => {
      if (res.ok){
        if (this.id != null) {
           this.musicService.getQueue().then((musics) => {
              this.musics = musics;
           });
        }
      }
    });
  }

  getPerformerName(performer: Performer) {
    return this.performerService.getPerformerName(performer, this.performers);
  }

  getGenreTitle(genre: Genre) {
    return this.genreService.getGenreTitle(genre, this.genres);
  }

  removeSong() {
    this.musicService.removeQueueSong(this.currentMusicId).then((res) => {
      if (res.ok){
        if (this.id != null) {
          this.musicService.getQueue().then((musics) => {
            this.musics = musics;
          });
        }
        document.getElementById("closeModal")?.click();
      }
    });

  }
}
