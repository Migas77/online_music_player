import {Component, inject} from '@angular/core';
import {Music} from "../models/Music";
import {MusicService} from "../music.service";

@Component({
  selector: 'app-musics',
  standalone: true,
  imports: [],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent {
  musics : Music[] = [];
  musicService : MusicService = inject(MusicService)

  constructor() {
    this.musicService.getMusics().then((musics : Music[]) => {
      this.musics = musics;
      console.log(this.musics)
    })
  }

}
