import {Component, inject} from '@angular/core';
import {AlbumService} from "../album.service";
import {Album} from "../models/Album";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-albums',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {
  albums : Album[] = [];
  albumService : AlbumService = inject(AlbumService)
  currentAlbumName! : string;
  currentAlbumId! : number;

  constructor() {
    this.albumService.getAlbums().then((albums : Album[]) => {
      this.albums = albums;})
  }

  deleteAlbum(id : number) {
    this.albumService.deleteAlbum(id).then((res: any) => {
      if (res.ok) {
        console.log("Band deleted successfully");
        this.albums = this.albums.filter(album => album.id !== id);
        document.getElementById("closeModal")?.click();
      }
    });
  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
