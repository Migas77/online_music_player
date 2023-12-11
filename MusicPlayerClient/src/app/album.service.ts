import { Injectable } from '@angular/core';
import {Album} from "./models/Album";

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getAlbums(): Promise<Album[]>{
    const url: string = this.baseURL + "albums";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  getAlbum(id: string) {
    const url: string = this.baseURL + "album/" + id;
    return fetch(url).then((response) => response.json());

  }

  createAlbum(album: Album) {
    const url: string = this.baseURL + "addAlbum";
    const formData = new FormData();
    formData.append('name', album.name);
    formData.append('image', album.image);
    formData.append('release_date', album.release_date.toString());
    formData.append('performer', album.performer.toString());

    return fetch(url, {
      method: 'POST',
      body: formData,
    });

  }

  updateAlbum(id: string, album: any) {
    const url: string = this.baseURL + "updateAlbum/" + id;
    const formData = new FormData();
    formData.append('name', album.name);
    formData.append('image', album.image);
    formData.append('release_date', album.release_date);
    formData.append('performer', album.performer);

    return fetch(url, {
      method: 'PUT',
      body: formData,
    });

  }

  deleteAlbum(id: number) {
    const url: string = this.baseURL + "deleteAlbum/" + id;
    return fetch(url, {
      method: 'DELETE',
    });

  }
}
