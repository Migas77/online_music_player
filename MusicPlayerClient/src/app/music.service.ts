import { Injectable } from '@angular/core';
import {Music} from "./models/Music";

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getMusicsByGenre(): Promise<Music[]>{
    const url: string = this.baseURL + "musicsbygenre";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getMusics(): Promise<Music[]>{
    const url: string = this.baseURL + "musics";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }
}
