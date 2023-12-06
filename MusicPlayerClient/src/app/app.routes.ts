import { Routes } from '@angular/router';
import {MusicsComponent} from "./musics/musics.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumsComponent} from "./albums/albums.component";
import {ArtistsComponent} from "./artists/artists.component";
import {BandsComponent} from "./bands/bands.component";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'musics', component: MusicsComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'artists', component: ArtistsComponent},
  {path: 'bands', component: BandsComponent},
];
