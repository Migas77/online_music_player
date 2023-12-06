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

}
