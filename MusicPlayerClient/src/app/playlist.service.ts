import {Injectable} from '@angular/core';
import {Playlist} from "./models/Playlist";
import {Music} from "./models/Music";

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
    const url: string = this.baseURL + "addMusicToPlaylist/" + musicId + "/" + playlistId;
    return await fetch(url, { method: 'POST' });
  }

  async createPlaylist(playlist: Playlist): Promise<Response> {
    const url: string = this.baseURL + "addPlaylist";
    const formData = new FormData();
    formData.append('name', playlist.name);
    formData.append('author', playlist.author.toString());

    return await fetch(url, {method: 'POST', body: formData});
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
