import {Component, inject} from '@angular/core';
import {Band} from "../models/Band";
import {BandService} from "../band.service";

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {
  bands : Band[] = [];
  bandService : BandService = inject(BandService)

  constructor() {
    this.bandService.getBands().then((bands : Band[]) => {
      this.bands = bands;
      console.log(this.bands)
    })
  }
}
