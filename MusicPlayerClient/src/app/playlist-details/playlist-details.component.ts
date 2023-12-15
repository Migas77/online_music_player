import {Component, inject, ViewChild} from '@angular/core';
import {PlaylistService} from "../playlist.service";
import {ActivatedRoute} from "@angular/router";
import {Playlist} from "../models/Playlist";
import {NgForOf} from "@angular/common";
import {Performer} from "../models/Performer";
import {PerformerService} from "../performer.service";
import {Genre} from "../models/Genre";
import {Music} from "../models/Music";
import {GenreService} from "../genre.service";
import {PlaybarComponent} from "../playbar/playbar.component";

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [
    NgForOf,
    PlaybarComponent
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.css'
})
export class PlaylistDetailsComponent {

  id!: string | null;
  playlist!: Playlist;
  currentMusicName!: string;
  currentMusicId!: number;
  musics!: Music[];
  playlistName!: string;

  performerService: PerformerService = inject(PerformerService);
  performers!: Performer[];

  genreService: GenreService = inject(GenreService);
  genres!: Genre[];

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private playlistService: PlaylistService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.playlistService.getPlaylist(this.id).then((playlist) => {
        this.playlist = playlist;
        this.playlistName = playlist.name;
        this.musics = playlist.musics;
      });
    }
    this.performerService.getPerformers().then((performers) => {
      this.performers = performers;
    });

    this.genreService.getGenres().then((genres) => {
      this.genres = genres;
    });
  }

  getPerformerName(performer: Performer) {
    return this.performerService.getPerformerName(performer, this.performers);
  }

  getGenreTitle(genre: Genre) {
    return this.genreService.getGenreTitle(genre, this.genres);
  }

  removeSong() {
    this.playlistService.removeSong(this.currentMusicId, this.playlist.id).then((res) => {
      if (res.ok){
        if (this.id != null) {
          this.playlistService.getPlaylist(this.id).then((playlist) => {
            this.playlist = playlist;
            this.musics = playlist.musics;
          });
        }
        document.getElementById("closeModal")?.click();
      }
    });

  }

  playSong(song: Music) {
    this.playbarComponent.playSong(song, this.playlist);
  }
}
