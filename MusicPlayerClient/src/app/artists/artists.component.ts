import {Component, inject} from '@angular/core';
import {ArtistService} from "../artist.service";
import {Artist} from "../models/Artist";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, HttpClientModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent {
  artists : Artist[] = [];
  artistService : ArtistService = inject(ArtistService)

  constructor() {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.artists = artists;
      console.log(this.artists)
    })
  }

  showModal(target: EventTarget | null) {
    if (target instanceof HTMLElement) {
      target.setAttribute('data-bs-toggle', 'modal');
      target.setAttribute('data-bs-target', '#exampleModal');
    }



  }
}
