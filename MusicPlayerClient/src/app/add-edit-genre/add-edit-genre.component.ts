import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GenreService} from "../genre.service";

@Component({
  selector: 'app-add-edit-genre',
  standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,

    ],
  templateUrl: './add-edit-genre.component.html',
  styleUrl: './add-edit-genre.component.css'
})
export class AddEditGenreComponent implements OnInit{

  addGenreForm!: FormGroup;
  id!: string | null;
  constructor(private fb: FormBuilder, private genreService: GenreService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.addGenreForm = this.fb.group({
      title: [''],
      image: ['']
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
      this.genreService.createGenre(genre).then((res: any) => {
          if (res.ok){
            console.log("Genre created successfully");
            this.addGenreForm.reset();
          }
        }
      );
    }
    else {
      this.genreService.updateGenre(this.id, genre).then((res: any) => {
        if (res.ok){
          console.log("Genre updated successfully");
          this.addGenreForm.reset();
          this.router.navigate(['/genres']);
        }
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

}
