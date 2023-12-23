import {Injectable} from '@angular/core';
import {Band} from "./models/Band";
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class BandService {

  private baseURL : string = BASE_URL;

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
    const formData = new FormData();
    formData.append('name', band.name);
    formData.append('description', band.description);
    formData.append('image', band.image)
    band.members.forEach((member : number) => formData.append('members', member.toString()));
    const data : Response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
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
    const data = await fetch(url, {
      method: 'PUT',
      body: formData,
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    return data.json()
  }

  async deleteBand(id: number) {
    const url: string = this.baseURL + "deleteBand/" + id;
    return await fetch(url, {
      method: 'DELETE',
    });
  }
}
