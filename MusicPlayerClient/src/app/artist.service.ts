import {Injectable} from '@angular/core';
import {Artist} from "./models/Artist";
import {retry} from "rxjs";

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

  async createArtist(artist: Artist): Promise<Response> {
    const url: string = this.baseURL + "addArtist";
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('image', artist.image);

    return await fetch(url, {
      method: 'POST',
      body: formData,
    });

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

    return  await fetch(url, {
      method: 'PUT',
      body: formData,
    });

  }

  async deleteArtist(id: number) {
    const url: string = this.baseURL + "deleteArtist/" + id;
    return await fetch(url, {
      method: 'DELETE',
    });
  }
}
