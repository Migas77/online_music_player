import {Injectable} from '@angular/core';
import {Genre} from "./models/Genre";
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private baseURL : string = BASE_URL;

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

  async createGenre(genre: any) {
    const url: string = this.baseURL + "addGenre";
    const formData = new FormData();
    formData.append('title', genre.title);
    formData.append('image', genre.image);
    const data = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async updateGenre(id: string, genre: any) {
    const url: string = this.baseURL + "updateGenre/" + id;
    const formData = new FormData();
    formData.append('title', genre.title);
    formData.append('image', genre.image);
    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async deleteGenre(id: number) {
    const url: string = this.baseURL + "deleteGenre/" + id;
    return await fetch(url, {
      method: 'DELETE',
    });
  }

  getGenreTitle(genre: Genre, genres: Genre[]) {
    const gid = Number(genre);
    const genre1 = genres.find(genre => genre.id === gid);
    return genre1 ? genre1.title : '';
  }
}
