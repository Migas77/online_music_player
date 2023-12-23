import {Injectable} from '@angular/core';
import {Album} from "./models/Album";
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseURL : string = BASE_URL;

  constructor() { }

  async getAlbums(): Promise<Album[]>{
    const url: string = this.baseURL + "albums";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getAlbum(id: string) {
    const url: string = this.baseURL + "album/" + id;
    return fetch(url).then((response) => response.json());

  }

  async createAlbum(album: Album) {
    const url: string = this.baseURL + "addAlbum";
    const formData = new FormData();
    formData.append('name', album.name);
    formData.append('image', album.image);
    formData.append('release_date', album.release_date.toString());
    formData.append('performer', album.performer.toString());
    const data = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    return data.json();

  }

  async updateAlbum(id: string, album: any) {
    const url: string = this.baseURL + "updateAlbum/" + id;
    const formData = new FormData();
    formData.append('name', album.name);
    formData.append('image', album.image);
    formData.append('release_date', album.release_date);
    formData.append('performer', album.performer);
    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()

  }

  async deleteAlbum(id: number) {
    const url: string = this.baseURL + "deleteAlbum/" + id;
    return await fetch(url, {
      method: 'DELETE',
    })
  }

  async getAlbumsByPerformer(performerId: number): Promise<Album[]> {
    const url: string = this.baseURL + "getAlbumsByPerformer/" + performerId;
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }
}
