import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ArtistService } from '../artist.service';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-edit-artist',
  templateUrl: './add-edit-artist.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrl: './add-edit-artist.component.css'
})
export class AddEditArtistComponent implements OnInit{

  addArtistForm!: FormGroup;
  id!: string | null;
  constructor(private fb: FormBuilder, private artistService: ArtistService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.addArtistForm = this.fb.group({
      name: [''],
      image: [''],
      description: ['']
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.artistService.getArtist(this.id).then((artist) => {
          this.addArtistForm.patchValue({
            name: artist.name,
            description: artist.description,
          });
        });
      }
    }
  }
  async onSubmit(): Promise<void>{
    const artist = this.addArtistForm.value;

    if (this.id == null) {
      this.artistService.createArtist(artist).then((res: any) => {
        if (res.ok){
          console.log("Artist created successfully");
          this.addArtistForm.reset();
        }
      }
      );
    }
    else {
      this.artistService.updateArtist(this.id, artist).then((res: any) => {
        if (res.ok){
          console.log("Artist updated successfully");
          this.addArtistForm.reset();
          this.router.navigate(['/artists']);
        }
      });
    }
  }

  onFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    this.addArtistForm.patchValue({
      image: file
    });
    this.addArtistForm.get('image')?.updateValueAndValidity();

  }
}
