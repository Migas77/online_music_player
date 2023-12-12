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

  async searchMusics(query: string): Promise<Music[]> {
    console.log("Im going to make the request")
    const url: string = this.baseURL + "searchMusic";
    const formData = new FormData();
    formData.append('query', query);
 
    const data: Response = await fetch(
      url, {
        method: 'POST',
        body: formData
      }
    );
 
    const songs = await data.json();
 
    // Group songs by genre
    const songsByGenre = songs.reduce((acc: { [x: string]: any[]; }, song: { genre: { title: any; }; }) => {
      const genre = song.genre.title;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(song);
      return acc;
    }, {});
 
    return songsByGenre;
 }
}
