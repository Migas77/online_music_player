import {Component, inject} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Playlist} from "../models/Playlist";
import {PlaylistService} from "../playlist.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css'
})
export class PlaylistsComponent {
  playlists : Playlist[] = [];
  playlistService : PlaylistService = inject(PlaylistService)
  currentPlaylistName! : string;
  currentPlaylistId! : number;

  constructor(private router: Router) {
    this.playlistService.getPlaylists().then((playlists : Playlist[]) => {
      this.playlists = playlists;
    })
  }

  async deletePlaylist(playlistId: number): Promise<void> {
    const res = await this.playlistService.deletePlaylist(playlistId);
    if (res.ok){
      this.playlists = this.playlists.filter(playlist => playlist.id !== playlistId);
      document.getElementById("closeModal")?.click();
    }
  }

  goToDetails(id: number) {
    this.router.navigate(['/playlistDetails', id]);
  }
}
