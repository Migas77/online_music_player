import {Injectable} from '@angular/core';
import {Artist} from "./models/Artist";
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private baseURL : string = BASE_URL;

  constructor() { }

  async getArtists(): Promise<Artist[]>{
    const url: string = this.baseURL + "artists";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async createArtist(artist: Artist): Promise<Response> {
    const url: string = this.baseURL + "addArtist";
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('image', artist.image);
    const data = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()

  }

  async getArtist(id: string) {
    const url: string = this.baseURL + "artist/" + id;
    const response = await fetch(url);
    return await response.json();
  }

  async updateArtist(id: string, artist: any) {
    const url: string = this.baseURL + "updateArtist/" + id;
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('image', artist.image);
    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async deleteArtist(id: number) {
    const url: string = this.baseURL + "deleteArtist/" + id;
    return await fetch(url, {
      method: 'DELETE',
    })

  }
}
