import {Component, inject} from '@angular/core';
import {Music} from "../models/Music";
import {MusicService} from "../music.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {BACKEND_URL} from "../consts";

@Component({
  selector: 'app-musics',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent {
  musics : Music[] = [];
  musicService : MusicService = inject(MusicService)
  currentMusicName! : string;
  currentMusicId! : number;


  constructor() {
    this.musicService.getMusics().then((musics : Music[]) => {
      this.musics = musics;
    })
  }

  deleteMusic(id : number) {
    this.musicService.deleteMusic(id).then((res: any) => {
      if (res.ok) {
        console.log("Music deleted successfully");
        this.musics = this.musics.filter(music => music.id !== id);
        document.getElementById("closeModal")?.click();
      }
    });
  }

    protected readonly BACKEND_URL = BACKEND_URL;
}
