import {Component, inject} from '@angular/core';
import {Genre} from "../models/Genre";
import {GenreService} from "../genre.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-genres',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {
  genres : Genre[] = [];
  genreService : GenreService = inject(GenreService)
  currentGenreTitle! : string;
  currentGenreId! : number;

  constructor() {
    this.genreService.getGenres().then((genres : Genre[]) => {
      this.genres = genres;
      console.log(this.genres)
    })
  }

  deleteGenre(id : number) {
    this.genreService.deleteGenre(id).then((res: any) => {
      if (res.ok){
        console.log("Genre deleted successfully");
        this.genres = this.genres.filter(genre => genre.id !== id);
        document.getElementById("closeModal")?.click();
      }
    });
  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
