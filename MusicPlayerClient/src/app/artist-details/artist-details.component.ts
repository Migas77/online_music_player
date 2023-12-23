import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Album } from '../models/Album';
import { Music } from '../models/Music';
import { Band } from '../models/Band';
import { Artist } from '../models/Artist';
import { Playlist } from '../models/Playlist';

import { AlbumService } from '../album.service';
import { PerformerService } from '../performer.service';
import { ArtistService } from '../artist.service';
import { MusicService } from '../music.service';
import { PlaylistService } from '../playlist.service';

import { PlaybarComponent } from '../playbar/playbar.component';
import {AuthService} from "../auth.service";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    CommonModule,
    PlaybarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent implements OnInit {

  performerService: PerformerService = inject(PerformerService);
  albumService: AlbumService = inject(AlbumService);
  artistService: ArtistService = inject(ArtistService);
  musicService: MusicService = inject(MusicService);
  playlistService : PlaylistService = inject(PlaylistService);
  authService : AuthService = inject(AuthService)

  musicsByAlbum: { [key: number]: Music[] } = {};

  playlists : Playlist[] = [];
  allArtists: Artist[] = [];
  artistAlbums: Album[] = [];

  currentMusicName! : string;

  performerDetails!: any;

  musicAdded: boolean = false;
  musicAddedFailed: boolean = false;
  musicAddedToQueue: boolean = false;

  createPlaylistForm!: FormGroup;

  currentMusicId! : number;
  id!: number;
  user: Number = 2;

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private fb: FormBuilder, private route: ActivatedRoute)  {
    this.createPlaylistForm = this.fb.group({
      name: '',
    });

    if (this.authService.isLoggedIn){
      this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
        this.playlists = playlists;
      })
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = Number(params['id']);
      if (this.id != null) {
        this.artistService.getArtists().then((artists) => {
          this.allArtists = artists;
        });

        this.performerService.getPerformerDetails(this.id).then((performer) => {
          if ('members' in performer)
            this.performerDetails = performer as Band;
          else
            this.performerDetails = performer as Artist;
        });

        this.albumService.getAlbumsByPerformer(this.id).then((albums) => {
          this.artistAlbums = albums;

          this.artistAlbums.forEach(album => {
            this.musicService.getMusicsByAlbum(album.id).then((musics) => {
              this.musicsByAlbum[album.id] = musics;
            });
          });
        });

      }
    });
  };

  async addMusicToPlaylist(musicId: number, playlistId: number) {
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
  };

  musicLiked(id: number) {
    let found = false;
    Object.values(this.musicsByAlbum).forEach(songs => {
        let song = songs.find(m => m.id == id);
        if (song && song.likes.filter(l => l.id == this.authService.userId).length > 0) {
            found = true;
        }
    });
    return found;
  };

  likeMusic(id: number) {
    this.musicService.likeMusic(id).then((res) => {
      if (res.ok){
        this.albumService.getAlbumsByPerformer(this.id).then((albums) => {
          this.artistAlbums = albums;

          this.artistAlbums.forEach(album => {
            this.musicService.getMusicsByAlbum(album.id).then((musics) => {
              this.musicsByAlbum[album.id] = musics;
            });
          });
        });
      }
    });
  };

  dislikeMusic(id: number) {
    this.musicService.dislikeMusic(id).then((res) => {
      if (res.ok) {
        this.albumService.getAlbumsByPerformer(this.id).then((albums) => {
          this.artistAlbums = albums;

          this.artistAlbums.forEach(album => {
            this.musicService.getMusicsByAlbum(album.id).then((musics) => {
              this.musicsByAlbum[album.id] = musics;
            });
          });
        });
      }
    });
  };

  async onSubmitCreatePlaylist(): Promise<void>{
    const playlist = this.createPlaylistForm.value;
    this.playlistService.createPlaylist(playlist).then((res: Playlist) => {
      console.log("Playlist created successfully");
      this.playlists.push(res)
      document.getElementById("closeAddPlaylistModal")?.click();
    });

  };

  addToQueue(id: number) {
    this.musicService.addToQueue(id);
    this.musicAddedToQueue = true;
    setTimeout(() => {
      this.musicAddedToQueue = false;
      }, 3000);

  }

  getObjectSize(obj: { [key: string] : any}): number {
    return obj ? Object.keys(obj).length : 0;
  };

  getArtist(artistId: number): any {
    if (artistId != null && this.allArtists.length > 0)
      return this.allArtists.find(artist => artist.id === artistId) ?? this.allArtists[0];
    else
      return null;
  };

  playSong(song: Music): void {
    this.playbarComponent.playSong(song);
  };

  playAlbum(albumId: number): void {
    this.playbarComponent.playAlbum(albumId);
  };

  playArtist(artistId: number): void {
    this.playbarComponent.playArtist(artistId);
  };

  getMusicsByAlbum(albumId: number): Music[] {
    let musics: Music[] = [];

    this.musicService.getMusicsByAlbum(albumId).then((m) => {
      musics = m;
    });
    return musics;
  };

  protected readonly BACKEND_URL = BACKEND_URL;
}
