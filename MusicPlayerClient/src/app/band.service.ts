import { Injectable } from '@angular/core';
import {Genre} from "./models/Genre";
import {Band} from "./models/Band";

@Injectable({
  providedIn: 'root'
})
export class BandService {
  deleteBand(bandName: String) {
    throw new Error('Method not implemented.');
  }

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getBands(): Promise<Band[]>{
    const url: string = this.baseURL + "bands";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }
}
