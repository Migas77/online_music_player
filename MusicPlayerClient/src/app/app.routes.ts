import { Routes } from '@angular/router';
import {MusicsComponent} from "./musics/musics.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumsComponent} from "./albums/albums.component";
import {ArtistsComponent} from "./artists/artists.component";
import {BandsComponent} from "./bands/bands.component";
import {AuthComponent} from "./auth/auth.component";
import {AdminComponent} from "./admin/admin.component";

export const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'musics', component: MusicsComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'artists', component: ArtistsComponent},
  {path: 'bands', component: BandsComponent},
  {path: 'admin', component: AdminComponent},
];
