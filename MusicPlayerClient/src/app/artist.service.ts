import { Injectable } from '@angular/core';
import {Genre} from "./models/Genre";
import {Artist} from "./models/Artist";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getArtists(): Promise<Artist[]>{
    const url: string = this.baseURL + "artists";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }
}