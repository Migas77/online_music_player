import {Component, inject} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Playlist} from "../models/Playlist";
import {PlaylistService} from "../playlist.service";

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css'
})
export class PlaylistsComponent {
  playlists : Playlist[] = [];
  playlistService : PlaylistService = inject(PlaylistService)

  constructor() {
    this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
      this.playlists = playlists;
      // console.log(this.playlists)
    })
  }

}
