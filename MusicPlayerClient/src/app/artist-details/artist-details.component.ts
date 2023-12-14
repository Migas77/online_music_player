import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Performer } from '../models/Performer';
import { Album } from '../models/Album';
import { AlbumService } from '../album.service';
import { PerformerService } from '../performer.service';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent {

  performerService: PerformerService = inject(PerformerService);
  albumService: AlbumService = inject(AlbumService);

  albums: Album[] = [];

  constructor() {
    
  }

}
