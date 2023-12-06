import {Component, inject} from '@angular/core';
import {AlbumService} from "../album.service";
import {Album} from "../models/Album";

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {
  albums : Album[] = [];
  albumService : AlbumService = inject(AlbumService)

  constructor() {
    this.albumService.getAlbums().then((albums : Album[]) => {
      this.albums = albums;
      console.log(this.albums)
    })
  }
}
