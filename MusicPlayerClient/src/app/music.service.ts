import { Injectable } from '@angular/core';
import { Music } from './models/Music';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private baseURL: string = 'http://localhost:8000/ws/';

  constructor() {}

  async getMusicsByGenre(): Promise<{ [key: string]: Music[] }> {
    const url: string = this.baseURL + 'musicsbygenre';
    const data: Response = await fetch(url);
    return (await data.json()) ?? [];
  }

  async getMusics(): Promise<Music[]> {
    const url: string = this.baseURL + 'musics';
    const data: Response = await fetch(url);
    return (await data.json()) ?? [];
  }

  async getMusic(id: string) {
    const url: string = this.baseURL + 'music/' + id;
    return fetch(url).then((response) => response.json());
  }

  async createMusic(music: any) {
    const url: string = this.baseURL + 'addMusic';
    const formData = new FormData();
    formData.append('name', music.name);
    formData.append('image', music.image);
    formData.append('genre', music.genre);
    formData.append('performer', music.performer);
    formData.append('album', music.album);
    formData.append('audio_file', music.audio_file);

    return fetch(url, {
      method: 'POST',
      body: formData,
    });
  }

  async updateMusic(id: string, music: any) {
    const url: string = this.baseURL + 'updateMusic/' + id;
    const formData = new FormData();
    formData.append('name', music.name);
    formData.append('image', music.image);
    formData.append('genre', music.genre);
    formData.append('performer', music.performer);
    formData.append('album', music.album);
    formData.append('audio_file', music.audio_file);

    return fetch(url, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteMusic(id: number) {
    const url: string = this.baseURL + 'deleteMusic/' + id;
    return fetch(url, {
      method: 'DELETE',
    });
  }

  async searchMusics(query: string): Promise<{ [key: string]: Music[] }> {
    const url: string =
      this.baseURL + 'searchMusic?query=' + encodeURIComponent(query);
    const formData = new FormData();
    formData.append('query', query);

    const data: Response = await fetch(url, {
      method: 'GET',
    });
    return (await data.json()) ?? [];
  }

  async getMusicsByPerformer(performerId: number): Promise<Music[]> {
    const url: string = this.baseURL + 'getMusicsByPerformer/' + performerId;
    const data: Response = await fetch(url);
    return (await data.json()) ?? [];
  }

  async getMusicsByAlbum(albumId: number): Promise<Music[]> {
    const url: string = this.baseURL + 'getMusicsByAlbum/' + albumId;
    const data: Response = await fetch(url);
    return (await data.json()) ?? [];
  }

  async likeMusic(song_id: number, user_id: number) {
    const url: string = this.baseURL + 'addLike/' + song_id + '/' + user_id;
    return fetch(url, { method: 'POST' });
  }

  dislikeMusic(song_id: number, user_id: number) {
    const url: string = this.baseURL + 'removeLike/' + song_id + '/' + user_id;
    return fetch(url, { method: 'DELETE' });
  }
}
