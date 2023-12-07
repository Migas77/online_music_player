import {Component, inject} from '@angular/core';
import {Band} from "../models/Band";
import {BandService} from "../band.service";
import { CommonModule } from '@angular/common';
import { Artist } from '../models/Artist';

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {
  bands : Band[] = [];
  bandService : BandService = inject(BandService)
  artists : Artist[] = [];
  bandName : String = "";
  
  constructor() {
    this.bandService.getBands().then((bands : Band[]) => {
      this.bands = bands;
      this.artists = bands.map((band : Band) => {
        return band.members
      }).flat()
      
      console.log(this.bands)
      console.log("ARTIS T: ", this.artists)
    })
    
  }

  getBandName() {
    return this.bandName;
  }

  setBandName(bandName : String) {
    this.bandName = bandName;
  }

  showModal() {
    let modal = document.getElementById("modal-id");
    modal?.classList.add("show");
    modal?.setAttribute("style", "display: block");
  }

  closeModal() {
    let modal = document.getElementById("modal-id");
    modal?.classList.remove("show");
    modal?.setAttribute("style", "display: none");
  }

  deleteBand(bandName : String) {
    this.bandService.deleteBand(bandName).then(() => {
      this.bands = this.bands.filter((band : Band) => {
        return band.name != bandName;
      })
    })
  }



  

}
