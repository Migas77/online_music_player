import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BandService} from "../band.service";
import {Artist} from "../models/Artist";
import {ArtistService} from "../artist.service";
import {convertOutputFile} from "@angular-devkit/build-angular/src/tools/esbuild/utils";

@Component({
  selector: 'app-add-edit-band',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-edit-band.component.html',
  styleUrl: './add-edit-band.component.css'
})
export class AddEditBandComponent implements OnInit {

  addBandForm!: FormGroup;
  id!: string | null;
  artists: Artist[] = [];
  artistService : ArtistService = inject(ArtistService);

  selectedArtists: number[] = [];

  constructor(private fb: FormBuilder, private bandService: BandService, private route: ActivatedRoute, private router: Router) {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.artists = artists;
    })
  }

  ngOnInit(): void {
    this.addBandForm = this.fb.group({
      name: [''],
      image: [''],
      description: [''],
      members: [[]]
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.bandService.getBand(this.id).then((band) => {
          this.addBandForm.patchValue({
            name: band.name,
            description: band.description,
            members: band.members
          });
        });
      }
    }
  }

  onMemberChange(e: any, id: number) {
    if (e.target.checked) {
      this.selectedArtists.push(id);
    }
    else {
      this.selectedArtists = this.selectedArtists.filter(m => m != id);
    }
  }

  async onSubmit(): Promise<void>{
    const band = this.addBandForm.value;
    console.log(band);
    band.members = [];
    for (let i = 0; i < this.selectedArtists.length; i++) {
      const artist = await this.artistService.getArtist(this.selectedArtists[i].toString());
      console.log("aaa", artist);
      band.members.push(artist)
      console.log("bbb", band.members);
    }
    if (this.id == null) {
      this.bandService.createBand(band).then((res: any) => {
          if (res.ok){
            console.log("Band created successfully");
            this.addBandForm.reset();
          }
        }
      );
    }
    else {
      this.bandService.updateBand(this.id, band).then((res: any) => {
        if (res.ok){
          console.log("Band updated successfully");
          this.addBandForm.reset();
          this.router.navigate(['/bands']);
        }
      });
    }
  }
  onFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    this.addBandForm.patchValue({
      image: file
    });
    this.addBandForm.get('image')?.updateValueAndValidity();

  }

}
