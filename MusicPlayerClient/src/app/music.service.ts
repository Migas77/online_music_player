import { Injectable } from '@angular/core';
import { Music } from './models/Music';
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private baseURL: string = BASE_URL;

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
    const data = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
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

    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
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

  async likeMusic(song_id: number) {
    const url: string = this.baseURL + 'addLike/' + song_id;
    return fetch(url, { method: 'POST' });
  }

  dislikeMusic(song_id: number) {
    const url: string = this.baseURL + 'removeLike/' + song_id;
    return fetch(url, { method: 'DELETE' });
  }

  async addToQueue(id: number) {
    const music = await this.getMusic(String(id));
    const queue = JSON.parse(localStorage.getItem('queue') || '[]');
    const isMusicInQueue = queue.some((queuedMusic: Music) => queuedMusic.id === music.id);

    if (!isMusicInQueue){
      queue.unshift(music);
    } else {
      const index = queue.findIndex((queuedMusic: Music) => queuedMusic.id === music.id);
      queue.splice(index, 1);
      queue.unshift(music);
    }

    localStorage.setItem('queue', JSON.stringify(queue));
  }

  async getQueue() {
    const queue = JSON.parse(localStorage.getItem('queue') || '[]');
    let q: Music[] = []
    for (let i = 0; i < queue.length; i++){
       await this.getMusic(queue[i].id).then((music: Music) => q.push(music))
    }
    return q
  }

  async removeQueueSong(currentMusicId: number) {
    let queue = JSON.parse(localStorage.getItem('queue')!);
    const music = await this.getMusic(String(currentMusicId));
    let index = queue.findIndex((m: Music) => m.id == music.id);
    queue.splice(index, 1);
    localStorage.setItem('queue', JSON.stringify(queue));
  }

  clearQueue() {
    localStorage.removeItem('queue');
  }
}
