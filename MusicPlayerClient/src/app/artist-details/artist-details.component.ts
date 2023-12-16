import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Album } from '../models/Album';
import { Music } from '../models/Music';
import { Band } from '../models/Band';
import { Artist } from '../models/Artist';

import { AlbumService } from '../album.service';
import { PerformerService } from '../performer.service';
import { ArtistService } from '../artist.service';
import { MusicService } from '../music.service';

import { PlaybarComponent } from '../playbar/playbar.component';
@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, CommonModule, RouterLink, PlaybarComponent],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent implements OnInit {

  performerService: PerformerService = inject(PerformerService);
  albumService: AlbumService = inject(AlbumService);
  artistService: ArtistService = inject(ArtistService);
  musicService: MusicService = inject(MusicService);

  artistAlbums: Album[] = [];
  musicsByAlbum: { [key: number]: Music[] } = {};
  performerDetails!: any;
  performerMusics: Music[] = [];
  allArtists: Artist[] = [];

  id!: number;

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  constructor(private route: ActivatedRoute)  {}

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
              console.log("MUSICS BY ALBUM: ", this.musicsByAlbum);
            });
          });
        });
      }
    });
  }

  getObjectSize(obj: { [key: string] : any}): number {
    return obj ? Object.keys(obj).length : 0;
  }

  getArtist(artistId: number): Artist {
    return this.allArtists.find(artist => artist.id === artistId) ?? this.allArtists[0];
  }

  playSong(song: Music): void {
    this.playbarComponent.playSong(song);
  }

  playAlbum(albumId: number): void {
    this.playbarComponent.playAlbum(albumId);
  }

  playArtist(artistId: number): void {
    this.playbarComponent.playArtist(artistId);
  }

  getMusicsByAlbum(albumId: number): Music[] {
    let musics: Music[] = [];

    this.musicService.getMusicsByAlbum(albumId).then((m) => {
      musics = m;
    });
    return musics;
  }

}
