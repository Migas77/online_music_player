import {Component, OnInit} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GenreService} from "../genre.service";
import {ErrorDisplayComponent} from "../error-display/error-display.component";
import {Genre} from "../models/Genre";

@Component({
  selector: 'app-add-edit-genre',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgTemplateOutlet,
    ErrorDisplayComponent,

  ],
  templateUrl: './add-edit-genre.component.html',
  styleUrl: './add-edit-genre.component.css'
})
export class AddEditGenreComponent implements OnInit{

  addGenreForm!: FormGroup;
  id!: string | null;
  submit_errors! : Genre;

  constructor(private fb: FormBuilder, private genreService: GenreService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.addGenreForm = this.fb.group({
      title: [''],
      image: ['', this.validateImageFileType],
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.genreService.getGenre(this.id).then((genre) => {
          this.addGenreForm.patchValue({
            title: genre.title,
          });
        });
      }
    }
  }
  async onSubmit(): Promise<void>{
    const genre = this.addGenreForm.value;
    if (this.id == null) {
      this.genreService.createGenre(genre)
        .then(res => {
          console.log("Genre created successfully");
          this.addGenreForm.reset();
        })
        .catch(error => {
          console.log(error.message)
          this.submit_errors = JSON.parse(error.message)
        });
    }
    else {
      this.genreService.updateGenre(this.id, genre)
        .then(res => {
          console.log("Genre updated successfully");
          this.addGenreForm.reset();
          this.router.navigate(['/genres']);
        })
        .catch(error => {
          this.submit_errors = JSON.parse(error.message)
        });
    }
  }

  onFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    this.addGenreForm.patchValue({
      image: file
    });
    this.addGenreForm.get('image')?.updateValueAndValidity();

  }

  validateImageFileType(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }


}
