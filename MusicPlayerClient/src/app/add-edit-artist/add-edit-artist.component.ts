import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ArtistService } from '../artist.service';

@Component({
  selector: 'app-add-edit-artist',
  templateUrl: './add-edit-artist.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './add-edit-artist.component.css'
})
export class AddEditArtistComponent implements OnInit{

  addArtistForm!: FormGroup;

  constructor(private fb: FormBuilder, private artistService: ArtistService) { }

  ngOnInit(): void {
    this.addArtistForm = this.fb.group({
      name: [''],
      image: [''],
      description: ['']
    });
  }

  async onSubmit(): Promise<void>{
    const artist = this.addArtistForm.value;
    await this.artistService.createArtist(artist);
    this.addArtistForm.reset();
  }

  onFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    this.addArtistForm.patchValue({
      image: file
    });
    this.addArtistForm.get('image')?.updateValueAndValidity();

  }
}
