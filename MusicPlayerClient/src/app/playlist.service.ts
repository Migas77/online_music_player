import {Injectable} from '@angular/core';
import {Playlist} from "./models/Playlist";
import {Music} from "./models/Music";
import {type} from "os";
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor() { }

  private baseURL : string = BASE_URL;
  async getPlaylists(): Promise<Playlist[]> {
    const url: string = this.baseURL + "playlists";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async addMusicToPlaylist(musicId: number, playlistId: number): Promise<Response> {
    const url: string = this.baseURL + "addMusicToPlaylist/" + musicId + "/" + playlistId;
    return await fetch(url, { method: 'POST' });
  }

  async createPlaylist(playlist: Playlist): Promise<Playlist> {
    const url: string = this.baseURL + "addPlaylist";
    const data = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(playlist)});
    return data.json();
  }

  async deletePlaylist(playlistId: number) {
    const url: string = this.baseURL + "deletePlaylist/" + playlistId;
    return await fetch(url, {method: 'DELETE'});
  }

  async getPlaylist(id: string) {
    const url: string = this.baseURL + "playlist/" + id;
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async removeSong(currentMusicId: number, id: number) {
    const url: string = this.baseURL + "deleteSongPlaylist/" + currentMusicId + "/" + id;
    return await fetch(url, {method: 'DELETE'});
  }

  sortPlaylist(id: number, previousIndex: number, currentIndex: number) {
    const url: string = this.baseURL + "sortPlaylist/" + id + "/" + previousIndex + "/" + currentIndex;
    return fetch(url, {method: 'POST'});
  }
}
