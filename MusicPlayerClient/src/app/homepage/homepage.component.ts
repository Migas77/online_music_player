import { Component, inject } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MusicService } from '../music.service';
import { Music } from '../models/Music';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  searchForm!: FormGroup;
  musics: Music[] = [];
  searchResult: Music[] = [];

  constructor(private fb: FormBuilder, private musicService: MusicService) {
    this.searchForm = this.fb.group({
      searchQuery: ''
    });
  }


  async onSubmit(): Promise<Music[]> {
    console.log("REACHED ON SUBMIT")
    let query = this.searchForm.value.searchQuery;
    if (query) 
      this.searchResult = await this.musicService.searchMusics(query);
    
    console.log("SEARCH RESULT:", this.searchResult);

    return this.searchResult;
  }

}
