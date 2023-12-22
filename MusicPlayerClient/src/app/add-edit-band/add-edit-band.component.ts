import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BandService} from "../band.service";
import {Artist} from "../models/Artist";
import {ArtistService} from "../artist.service";
import {Band} from "../models/Band";
import {ErrorDisplayComponent} from "../error-display/error-display.component";

@Component({
  selector: 'app-add-edit-band',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    ErrorDisplayComponent,
  ],
  templateUrl: './add-edit-band.component.html',
  styleUrl: './add-edit-band.component.css'
})
export class AddEditBandComponent implements OnInit{

  addBandForm!: FormGroup;
  id!: string | null;
  submit_errors! : Artist;
  artists: Artist[] = [];
  selectedArtistIds: number[] = [];
  artistService : ArtistService = inject(ArtistService);


  constructor(private fb: FormBuilder, private bandService: BandService, private route: ActivatedRoute, private router: Router) {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.artists = artists
      this.addBandForm = this.fb.group({
        name: '',
        image: ['', this.validateImageFileType],
        description: '',
        members: this.route.snapshot.paramMap.get('id') ? this.fb.array([]) : this.fb.array(artists.map((a : Artist) => this.fb.control(false)))
      });
    })
    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.bandService.getBand(this.id).then((band) => {
          this.addBandForm.patchValue({
            name: band.name,
            description: band.description,
          });
          this.selectedArtistIds = band.members;
          const membersControls = this.artists.map((a : Artist) => {
            return this.fb.control(this.selectedArtistIds.includes(a.id));
          });
          this.addBandForm.setControl('members', this.fb.array(membersControls));
        });
      }
    }
  }

  ngOnInit(): void {
    this.addBandForm = this.fb.group({
      name: '',
      image: ['', this.validateImageFileType],
      description: '',
      members: this.fb.array([])
    });
  }

  get members() {
    return this.addBandForm.get('members') as FormArray;
  };

  getMemberFormControl(index: number): FormControl {
    return this.members.at(index) as FormControl;
  }

  async onSubmit(): Promise<void>{
    let band = this.addBandForm.value
    if (this.id == null) {
      band.members = band.members.map((selected: boolean, i: number) => {
        if (selected)
          return this.artists[i].id;
        return undefined
      }).filter((m : any) => m!==undefined)
      this.bandService.createBand(band)
        .then(res  => {
          console.log(res)
          console.log("Band created successfully");
          this.addBandForm.reset();
        })
        .catch(error => {
          this.submit_errors = JSON.parse(error.message)
        });
    }
    else {
      band.members = band.members.map((selected: boolean, i: number) => {
        if (selected)
          return this.artists[i].id;
        return undefined
      }).filter((m : any) => m!==undefined)
      this.bandService.updateBand(this.id, band)
        .then((res: any) => {
          console.log("Band updated successfully");
          this.addBandForm.reset();
          this.router.navigate(['/bands']);
        })
        .catch(error => {
          this.submit_errors = JSON.parse(error.message)
        });
    }
  }
  onFileChange(event: Event) {
    const file : File = (event.target as HTMLInputElement).files![0];
    this.addBandForm.patchValue({
      image: file
    });
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
