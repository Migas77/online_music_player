import { Injectable } from '@angular/core';
import {Music} from "./models/Music";
import {Genre} from "./models/Genre";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getGenres(): Promise<Genre[]>{
    const url: string = this.baseURL + "genres";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getGenre(id: string) {
    const url: string = this.baseURL + "genre/" + id;
    return fetch(url).then((response) => response.json());

  }

  createGenre(genre: any) {
    const url: string = this.baseURL + "addGenre";
    const formData = new FormData();
    formData.append('title', genre.title);
    formData.append('image', genre.image);

    return fetch(url, {
      method: 'POST',
      body: formData,
    });

  }

  updateGenre(id: string, genre: any) {
    const url: string = this.baseURL + "updateGenre/" + id;
    const formData = new FormData();
    formData.append('title', genre.title);
    formData.append('image', genre.image);

    return fetch(url, {
      method: 'PUT',
      body: formData,
    });
  }

  deleteGenre(id: number) {
    const url: string = this.baseURL + "deleteGenre/" + id;
    return fetch(url, {
      method: 'DELETE',
    });
  }
}
