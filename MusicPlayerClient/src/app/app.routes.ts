import { Routes } from '@angular/router';
import { MusicsComponent } from "./musics/musics.component";
import { GenresComponent } from "./genres/genres.component";
import { AlbumsComponent } from "./albums/albums.component";
import { ArtistsComponent } from "./artists/artists.component";
import { BandsComponent } from "./bands/bands.component";
import { AuthComponent } from "./auth/auth.component";
import { AdminComponent } from "./admin/admin.component";
import { AddEditArtistComponent } from "./add-edit-artist/add-edit-artist.component";
import { AddEditGenreComponent } from "./add-edit-genre/add-edit-genre.component";
import { AddEditBandComponent } from "./add-edit-band/add-edit-band.component";
import { AddEditAlbumComponent } from "./add-edit-album/add-edit-album.component";
import { AddEditMusicComponent } from "./add-edit-music/add-edit-music.component";
import { HomepageComponent } from './homepage/homepage.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import {PlaylistsComponent} from "./playlists/playlists.component";
import {PlaylistDetailsComponent} from "./playlist-details/playlist-details.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {QueueListComponent} from "./queue-list/queue-list.component";
import {superuserGuard} from "./superuser.guard";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'musics', component: MusicsComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'artists', component: ArtistsComponent},
  {path: 'bands', component: BandsComponent},
  {path: 'artistDetails/:id', component: ArtistDetailsComponent},
  // administrator
  {path: 'admin', component: AdminComponent, canActivate: [superuserGuard]},
  {path: 'addArtist', component: AddEditArtistComponent, canActivate: [superuserGuard]},
  {path: 'editArtist/:id', component: AddEditArtistComponent, canActivate: [superuserGuard]},
  {path: 'addGenre', component: AddEditGenreComponent, canActivate: [superuserGuard]},
  {path: 'editGenre/:id', component: AddEditGenreComponent, canActivate: [superuserGuard]},
  {path: 'addBand', component: AddEditBandComponent, canActivate: [superuserGuard]},
  {path: 'editBand/:id', component: AddEditBandComponent, canActivate: [superuserGuard]},
  {path: 'addAlbum', component: AddEditAlbumComponent, canActivate: [superuserGuard]},
  {path: 'editAlbum/:id', component: AddEditAlbumComponent, canActivate: [superuserGuard]},
  {path: 'addMusic', component: AddEditMusicComponent, canActivate: [superuserGuard]},
  {path: 'editMusic/:id', component: AddEditMusicComponent, canActivate: [superuserGuard]},
  {path: 'playlists', component: PlaylistsComponent, canActivate: [authGuard]},
  {path: 'playlistDetails/:id', component: PlaylistDetailsComponent, canActivate: [authGuard]},
  {path: 'queue', component: QueueListComponent, canActivate: [authGuard]},
];
