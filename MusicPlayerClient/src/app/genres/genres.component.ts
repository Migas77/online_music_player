import {Component, inject} from '@angular/core';
import {Genre} from "../models/Genre";
import {GenreService} from "../genre.service";

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {
  genres : Genre[] = [];
  genreService : GenreService = inject(GenreService)

  constructor() {
    this.genreService.getGenres().then((genres : Genre[]) => {
      this.genres = genres;
      console.log(this.genres)
    })
  }
}
