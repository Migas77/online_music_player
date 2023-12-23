import {Component, inject} from '@angular/core';
import {Band} from "../models/Band";
import {BandService} from "../band.service";
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {
  bands : Band[] = [];
  bandService : BandService = inject(BandService);
  currentBandName! : string;
  currentBandId! : number;

  constructor() {
    this.bandService.getBands().then((bands : Band[]) => {
      this.bands = bands;
    })
  }

  deleteBand(id : number) {
    this.bandService.deleteBand(id).then((res: any) => {
      if (res.ok) {
        console.log("Band deleted successfully");
        this.bands = this.bands.filter(band => band.id !== id);
        document.getElementById("closeModal")?.click();
      }
    });
  }

  protected readonly BACKEND_URL = BACKEND_URL;
}
