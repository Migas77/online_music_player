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
}
