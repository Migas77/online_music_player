import { Injectable } from '@angular/core';
import {Music} from "./models/Music";

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getMusicsByGenre(): Promise<{ [key: string]: Music[] }>{
    const url: string = this.baseURL + "musicsbygenre";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getMusics(): Promise<Music[]>{
    const url: string = this.baseURL + "musics";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getMusic(id: string) {
    const url: string = this.baseURL + "music/" + id;
    return fetch(url).then((response) => response.json());
  }

  async createMusic(music: any){
    const url: string = this.baseURL + "addMusic";
    const formData = new FormData();
    formData.append('name', music.name);
    formData.append('image', music.image);
    formData.append('genre', music.genre);
    formData.append('performer', music.performer);
    formData.append('album', music.album);
    formData.append('audio_file', music.audio_file);
    const data = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async updateMusic(id: string, music: any) {
    const url: string = this.baseURL + "updateMusic/" + id;
    const formData = new FormData();
    formData.append('name', music.name);
    formData.append('image', music.image);
    formData.append('genre', music.genre);
    formData.append('performer', music.performer);
    formData.append('album', music.album);
    formData.append('audio_file', music.audio_file);
    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async deleteMusic(id: number) {
    const url: string = this.baseURL + "deleteMusic/" + id;
    const data = await fetch(url, {
      method: 'DELETE',
    });
    if (data.status != 204)
      throw new Error()
    return data.text()
  }

  async searchMusics(query: string): Promise<{ [key: string]: Music[] }> {
    const url: string = this.baseURL + "searchMusic?query=" + encodeURIComponent(query);
    const formData = new FormData();
    formData.append('query', query);

    const data: Response = await fetch(
      url, {
        method: 'GET'
      }
    );
    return await data.json() ?? [];
 }
}
