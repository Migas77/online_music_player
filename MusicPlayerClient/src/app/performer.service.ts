import { Injectable } from '@angular/core';
import { Performer } from './models/Performer';
import { Band } from './models/Band';
import { Artist } from './models/Artist';
import {BASE_URL} from "./consts";

@Injectable({
  providedIn: 'root'
})
export class PerformerService {

  private baseURL : string = BASE_URL;

  constructor() { }

  async getPerformers(): Promise<Performer[]>{
    const url: string = this.baseURL + "performers";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  getPerformerName(performerId: Performer, performers: Performer[]): string {
    const pfid = Number(performerId);
    const performer = performers.find(performer => performer.id === pfid);
    return performer ? performer.name : '';
  }

  async getPerformerDetails(performerId: number): Promise<any> {
    const url: string = this.baseURL + "getPerformerDetails/" + performerId;
    const  data: Response = await fetch(url);
    const res = await data.json();
    if ('members' in res) {
      console.log(res.members);
      return res as Band;
    } else
      return res as Artist;
  }

}
