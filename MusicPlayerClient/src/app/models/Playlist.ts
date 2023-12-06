import {Listener} from "./Listener";
import {Music} from "./Music";

export interface Playlist{
  id : number,
  name : string,
  author : Listener,
  musics : Music[],
  order : JSON
}
