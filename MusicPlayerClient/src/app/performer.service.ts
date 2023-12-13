import { Injectable } from '@angular/core';
import { Performer } from './models/Performer';

@Injectable({
  providedIn: 'root'
})
export class PerformerService {

  private baseURL : string = "http://localhost:8000/ws/";

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
}
