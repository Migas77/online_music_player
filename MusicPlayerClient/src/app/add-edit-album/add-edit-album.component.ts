import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Artist} from "../models/Artist";
import {ArtistService} from "../artist.service";
import {BandService} from "../band.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Band} from "../models/Band";
import {AlbumService} from "../album.service";
import {Performer} from "../models/Performer";

@Component({
  selector: 'app-add-edit-album',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './add-edit-album.component.html',
  styleUrl: './add-edit-album.component.css'
})
export class AddEditAlbumComponent implements OnInit {
  addAlbumForm!: FormGroup;
  id!: string | null;
  performers: Performer[] = [];
  artistService : ArtistService = inject(ArtistService);
  bandService : BandService = inject(BandService);


  constructor(private fb: FormBuilder, private albumService: AlbumService, private route: ActivatedRoute, private router: Router) {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.performers = artists
    })

    this.bandService.getBands().then((bands : Band[]) => {
      this.performers = this.performers.concat(bands)
    })

    this.addAlbumForm = this.fb.group({
      name: '',
      image: '',
      release_date: '',
      performer: ''
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.albumService.getAlbum(this.id).then((album) => {
          this.addAlbumForm.patchValue({
            name: album.name,
            release_date: album.release_date,
            performer: album.performer
          });
        });
      }
    }
  }

  ngOnInit(): void {
    this.addAlbumForm = this.fb.group({
      name: '',
      image: '',
      release_date: '',
      performer: ''
    });
  }
  async onSubmit(): Promise<void>{
    let album = this.addAlbumForm.value
    if (this.id == null) {
      this.albumService.createAlbum(album).then((res: Response) => {
        if (res.ok)
          console.log("Album created successfully");
          this.addAlbumForm.reset();
      })
    }
    else {
      this.albumService.updateAlbum(this.id, album).then((res: any) => {
        if (res.ok){
          console.log("Album updated successfully");
          this.addAlbumForm.reset();
          this.router.navigate(['/albums']);
        }
      });
    }
  }

  onFileChange(event: Event) {
    const file : File = (event.target as HTMLInputElement).files![0];
    this.addAlbumForm.patchValue({
      image: file
    });
  }

}
