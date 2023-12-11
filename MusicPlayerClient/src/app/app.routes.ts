import { Routes } from '@angular/router';
import {MusicsComponent} from "./musics/musics.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumsComponent} from "./albums/albums.component";
import {ArtistsComponent} from "./artists/artists.component";
import {BandsComponent} from "./bands/bands.component";
import {AuthComponent} from "./auth/auth.component";
import {AdminComponent} from "./admin/admin.component";
import {AddEditArtistComponent} from "./add-edit-artist/add-edit-artist.component";
import {AddEditGenreComponent} from "./add-edit-genre/add-edit-genre.component";
import {AddEditBandComponent} from "./add-edit-band/add-edit-band.component";
import {AddEditAlbumComponent} from "./add-edit-album/add-edit-album.component";

export const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'musics', component: MusicsComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'artists', component: ArtistsComponent},
  {path: 'bands', component: BandsComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'addArtist', component: AddEditArtistComponent},
  {path: 'editArtist/:id', component: AddEditArtistComponent},
  {path: 'addGenre', component: AddEditGenreComponent},
  {path: 'editGenre/:id', component: AddEditGenreComponent},
  {path: 'addBand', component: AddEditBandComponent},
  {path: 'editBand/:id', component: AddEditBandComponent},
  {path: 'addAlbum', component: AddEditAlbumComponent},
  {path: 'editAlbum/:id', component: AddEditAlbumComponent},

];
