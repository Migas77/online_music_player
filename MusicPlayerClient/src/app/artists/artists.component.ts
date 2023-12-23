import {Component, inject} from '@angular/core';
import {ArtistService} from "../artist.service";
import {Artist} from "../models/Artist";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, HttpClientModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent {
  artists : Artist[] = [];
  artistService : ArtistService = inject(ArtistService);
  currentArtistName! : string;
  currentArtistId! : number;

  constructor() {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.artists = artists;
    })
  }

  deleteArtist(id : number) {
    this.artistService.deleteArtist(id).then((res: any) => {
      if (res.ok){
        console.log("Artist deleted successfully");
        this.artists = this.artists.filter(artist => artist.id !== id);
        document.getElementById("closeModal")?.click();
      }
    });
  }


    protected readonly BACKEND_URL = BACKEND_URL;
}
