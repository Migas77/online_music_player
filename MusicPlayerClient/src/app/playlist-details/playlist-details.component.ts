import {Component, inject, ViewChild} from '@angular/core';
import {PlaylistService} from "../playlist.service";
import {ActivatedRoute, RouterLink, Router} from "@angular/router";
import {Playlist} from "../models/Playlist";
import {NgForOf, NgIf} from "@angular/common";
import {Performer} from "../models/Performer";
import {PerformerService} from "../performer.service";
import {Genre} from "../models/Genre";
import {Music} from "../models/Music";
import {GenreService} from "../genre.service";
import {PlaybarComponent} from "../playbar/playbar.component";
import {FormsModule} from "@angular/forms";
import {MusicService} from "../music.service";
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from "@angular/cdk/drag-drop";
import {AuthService} from "../auth.service";
import {BACKEND_URL} from "../consts";


@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [
    NgForOf,
    PlaybarComponent,
    FormsModule,
    NgIf,
    CdkDropList,
    CdkDrag,
    RouterLink
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.css'
})
export class PlaylistDetailsComponent {

  authService : AuthService = inject(AuthService);

  id!: string | null;
  playlist!: Playlist;
  currentMusicName!: string;
  currentMusicId!: number;
  musics!: Music[];
  playlistName!: string;

  performerService: PerformerService = inject(PerformerService);
  performers: Performer[] =  [];

  genreService: GenreService = inject(GenreService);
  genres: Genre[] = [];

  musicService: MusicService = inject(MusicService);

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private playlistService: PlaylistService, private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.playlistService.getPlaylist(this.id).then((playlist) => {
        this.playlist = playlist;
        this.playlistName = playlist.name;
        //obter as musicas pela ordem da playlist
        this.musics = playlist.musics;
        const order = playlist.order;
        this.musics.sort((a, b) => {
          return order.indexOf(a.id) - order.indexOf(b.id);
        });
      });
    }
    this.performerService.getPerformers().then((performers) => {
      this.performers = performers;
    });

    this.genreService.getGenres().then((genres) => {
      this.genres = genres;
    });

  }

  goToArtist(id: number) {
    this.router.navigate(['/artist-details', id]);
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
            this.musics = playlist.musics.sort((a: Music, b: Music) => {
              return playlist.order.indexOf(a.id) - playlist.order.indexOf(b.id);
            });
          });
        }
        document.getElementById("closeModal")?.click();
      }
    });

  }

  playSong(song: Music) {
    this.playbarComponent.playPlaylist(this.playlist.id, song);
  }

  musicLiked(id: number) {
    return this.musics.filter(m => m.id == id)[0].likes.filter(l => l.id == this.authService.userId).length > 0;
  }

  likeMusic(id: number) {
    this.musicService.likeMusic(id).then((res) => {
      if (res.ok){
        if (this.id != null) {
          this.playlistService.getPlaylist(this.id).then((playlist) => {
            this.playlist = playlist;
            this.musics = playlist.musics.sort((a: Music, b: Music) => {
              return playlist.order.indexOf(a.id) - playlist.order.indexOf(b.id);
            });
          });
        }
      }
    });
  }

  dislikeMusic(id: number) {
    this.musicService.dislikeMusic(id).then((res) => {
      if (res.ok){
        if (this.id != null) {
          this.playlistService.getPlaylist(this.id).then((playlist) => {
            this.playlist = playlist;
            this.musics = playlist.musics.sort((a: Music, b: Music) => {
              return playlist.order.indexOf(a.id) - playlist.order.indexOf(b.id);
            });
          });
        }
      }
    });
  }

  drop(event: CdkDragDrop<Music[]>) {
    moveItemInArray(this.musics, event.previousIndex, event.currentIndex);
    this.playlistService.sortPlaylist(this.playlist.id, event.previousIndex, event.currentIndex).then((res) => {
        if (res.ok){
          if (this.id != null) {
            this.playlistService.getPlaylist(this.id).then((playlist) => {
              this.playlist = playlist;
              this.musics = playlist.musics.sort((a: Music, b: Music) => {
                  return playlist.order.indexOf(a.id) - playlist.order.indexOf(b.id);
                }
              );
            });
          }
        }
      }
    );
  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
