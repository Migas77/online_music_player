import { Injectable } from '@angular/core';
import {Playlist} from "./models/Playlist";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor() { }

  private baseURL : string = "http://localhost:8000/ws/";
  async getPlaylists(): Promise<Playlist[]> {
    const url: string = this.baseURL + "playlists";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async addMusicToPlaylist(musicId: number, playlistId: number): Promise<Response> {
    const url: string = this.baseURL + "addMusicToPlaylist/" + playlistId + "/" + musicId;
    const data: Response = await fetch(url, { method: 'POST' });
    return await data.json() ?? [];
  }

  async createPlaylist(playlist: Playlist): Promise<Response> {
    const url: string = this.baseURL + "addPlaylist";
    const formData = new FormData();
    formData.append('name', playlist.name);

    const data: Response = await fetch(url, { method: 'POST', body: formData });
    return await data.json() ?? [];
  }
}
