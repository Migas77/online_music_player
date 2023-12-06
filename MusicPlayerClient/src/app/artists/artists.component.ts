import {Component, inject} from '@angular/core';
import {ArtistService} from "../artist.service";
import {Artist} from "../models/Artist";

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [],
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
}
