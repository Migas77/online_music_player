import { Injectable } from '@angular/core';
import {Genre} from "./models/Genre";
import {Artist} from "./models/Artist";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getArtists(): Promise<Artist[]>{
    const url: string = this.baseURL + "artists";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async createArtist(artist: Artist): Promise<void> {
    const url: string = this.baseURL + "addArtist";
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('image', artist.image);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    return await response.json();

  }

  async getArtist(id: string) {
    console.log(id);
    const url: string = this.baseURL + "artist/" + id;
    let response = await fetch(url);
    return await response.json();
  }

  async updateArtist(id: string, artist: any) {
    const url: string = this.baseURL + "updateArtist/" + id;
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('image', artist.image);

    const response = await fetch(url, {
      method: 'PUT',
      body: formData,
    });

    return await response.json();

  }
}
