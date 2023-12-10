import { Injectable } from '@angular/core';
import {Genre} from "./models/Genre";
import {Band} from "./models/Band";

@Injectable({
  providedIn: 'root'
})
export class BandService {

  private baseURL : string = "http://localhost:8000/ws/";

  constructor() { }

  async getBands(): Promise<Band[]>{
    const url: string = this.baseURL + "bands";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getBand(id: string) {
    const url: string = this.baseURL + "band/" + id;
    return fetch(url).then((res) => res.json());
  }

  async createBand(band: Band) : Promise<Band> {
    const url: string = this.baseURL + "addBand";
    const data : Response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(band),
    });
    return data.json()
  }

  async updateBand(id: string, band: any) {
    const url: string = this.baseURL + "updateBand/" + id;
    const formData = new FormData();
    formData.append('name', band.name);
    formData.append('image', band.image);
    formData.append('description', band.description);
    for (let i = 0; i < band.members.length; i++) {
      formData.append('members', JSON.stringify(band.members[i]));
    }
    return fetch(url, {
      method: 'PUT',
      body: formData,
    });

  }

  async deleteBand(id: number) {
    const url: string = this.baseURL + "deleteBand/" + id;
    return fetch(url, {
      method: 'DELETE',
    });
  }
}
