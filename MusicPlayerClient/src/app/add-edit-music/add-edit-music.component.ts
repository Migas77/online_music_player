import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Performer} from "../models/Performer";
import {ArtistService} from "../artist.service";
import {BandService} from "../band.service";
import {AlbumService} from "../album.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Artist} from "../models/Artist";
import {Band} from "../models/Band";
import {MusicService} from "../music.service";
import {Album} from "../models/Album";
import {Genre} from "../models/Genre";
import {GenreService} from "../genre.service";
import {Music} from "../models/Music";
import {type} from "os";
import {ErrorDisplayComponent} from "../error-display/error-display.component";

@Component({
  selector: 'app-add-edit-music',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgTemplateOutlet,
    ErrorDisplayComponent
  ],
  templateUrl: './add-edit-music.component.html',
  styleUrl: './add-edit-music.component.css'
})
export class AddEditMusicComponent implements OnInit {
  addMusicForm!: FormGroup;
  id!: string | null;
  submit_errors! : Music;
  performers: Performer[] = [];
  albums: Album[] = [];
  genres: Genre[] = [];
  artistService : ArtistService = inject(ArtistService);
  bandService : BandService = inject(BandService);
  albumService : AlbumService = inject(AlbumService);
  genreService : GenreService = inject(GenreService);


  constructor(private fb: FormBuilder, private musicService: MusicService, private route: ActivatedRoute, private router: Router) {

    this.artistService.getArtists().then((artists : Artist[]) => {
      this.performers = artists
    })

    this.bandService.getBands().then((bands : Band[]) => {
      this.performers = this.performers.concat(bands)
    })

    this.genreService.getGenres().then((genres : Genre[]) => {
      this.genres = genres
    })

    this.addMusicForm = this.fb.group({
      name: '',
      image: '',
      genre: '',
      performer: '',
      album: '',
      audio_file: '',
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.musicService.getMusic(this.id).then((music) => {
          this.addMusicForm.patchValue({
            name: music.name,
            genre: music.genre,
            performer: music.performer,
            album: music.album,
          });
        });
      }
    }
  }

  ngOnInit(): void {
    this.addMusicForm = this.fb.group({
      name: '',
      image: ['', this.validateImageFileType],
      genre: '',
      performer: '',
      album: '',
      audio_file: ['', this.validateAudioFileType],
    });
  }
  async onSubmit(): Promise<void>{
    let music = this.addMusicForm.value
    if (this.id == null) {
      this.musicService.createMusic(music)
        .then(res => {
          console.log("Music created successfully");
          this.addMusicForm.reset();
        })
        .catch(error => {
          this.submit_errors = JSON.parse(error.message)
        });
    }
    else {
      this.musicService.updateMusic(this.id, music)
        .then(res => {
          console.log("Music updated successfully");
          this.addMusicForm.reset();
          this.router.navigate(['/musics']);
        })
        .catch(error => {
          this.submit_errors = JSON.parse(error.message)
        });
    }
  }

  onPerformerSelect(): void {
    const performer = this.addMusicForm.get('performer')?.value;

    if (performer) {
      this.albumService.getAlbumsByPerformer(performer).then((albuns) => {
        this.albums = albuns
      })
    }
  }

  validateAudioFileType(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (!['mp3', 'wav'].includes(fileExtension)) {
        return { invalidFileType: true };
      }
    }
    return null;
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


  onFileChange(event: Event) {
    const file : File = (event.target as HTMLInputElement).files![0];
    this.addMusicForm.patchValue({
      image: file
    });
  }

  onMusicFileChange(event: Event) {
    const file : File = (event.target as HTMLInputElement).files![0];
    this.addMusicForm.patchValue({
      audio_file: file
    });
  }
}
