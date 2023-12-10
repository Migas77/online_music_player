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
import {List} from "postcss/lib/list";
import {
  checkCustomElementSelectorForErrors
} from "@angular/compiler-cli/src/ngtsc/annotations/component/src/diagnostics";
import {EventLoopMonitorOptions} from "perf_hooks";

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
export class AddEditBandComponent implements OnInit{

  addBandForm!: FormGroup;
  id!: string | null;
  artists: Artist[] = [];
  artistService : ArtistService = inject(ArtistService);

  constructor(private fb: FormBuilder, private bandService: BandService, private route: ActivatedRoute, private router: Router) {
    this.artistService.getArtists().then((artists : Artist[]) => {
      this.artists = artists
      this.addBandForm = this.fb.group({
        name: '',
        image: '',
        description: '',
        members: this.fb.array(
          this.artists.map((a : Artist) => {
            return this.fb.control(false);
          })
        )
      });
    })
  }

  ngOnInit(): void {
    this.addBandForm = this.fb.group({
      name: '',
      image: '',
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

  onMemberChange(e: any, id: number) {
  }

  async onSubmit(): Promise<void>{
    let band = this.addBandForm.value
    // search true and falses for the values
    band.members = band.members.map((selected: boolean, i: number) => {
      if (selected)
        return {
          id: this.artists[i].id, // Assuming Artist has an 'id' property
        };
      return undefined
    }).filter((m : any) => m!==undefined)

  }
  onFileChange($event: Event) {
  }
}
