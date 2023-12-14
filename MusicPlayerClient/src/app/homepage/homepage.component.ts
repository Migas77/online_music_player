import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { NgForOf, NgIf, CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MusicService } from '../music.service';
import { PerformerService } from '../performer.service';
import { Music } from '../models/Music';
import { Performer } from '../models/Performer';
import { PlaybarComponent } from '../playbar/playbar.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, CommonModule, PlaybarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  @ViewChild(PlaybarComponent) playbarComponent!: PlaybarComponent;

  musicService: MusicService = inject(MusicService);
  performerService: PerformerService = inject(PerformerService);
  
  searchForm!: FormGroup;
  musicsByGenre: { [key: string] :Music[]} = {};
  allMusics: Music[] = [];
  performers: Performer[] = [];
  searchResult: { [key: string] :Music[]};

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {

    this.performerService.getPerformers().then((performers: Performer[]) => {
      this.performers = performers;
    });

    this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
      this.musicsByGenre = musics;
    });

    this.searchForm = this.fb.group({
      searchQuery: ''
    });

    this.searchResult = {};

    console.log("SEARCH RESULT: ", this.searchResult)

  }

  async onSubmit(): Promise<{ [key: string] :Music[]}> {
    this.searchResult = {};
    let query = this.searchForm.value.searchQuery;
    if (query) {
      this.musicsByGenre = {};
      this.searchResult = await this.musicService.searchMusics(query);
    } else {
      this.searchResult = {};
      this.musicService.getMusicsByGenre().then((musics: { [key: string] :Music[]}) => {
        this.musicsByGenre = musics;
      });
    }

    return this.searchResult;
  }

  getName(performer: Performer): string {
    return this.performerService.getPerformerName(performer, this.performers)
  }

  playSong(song: Music): void {
    this.playbarComponent.playSong(song);
  }

  getObjectSize(obj: { [key: string] : any}): number {
    return Object.keys(obj).length;
  }
}
