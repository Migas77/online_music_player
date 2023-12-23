import {Genre} from "./Genre";
import {Performer} from "./Performer";
import {Album} from "./Album";
import {Listener} from "./Listener";

export interface Music{
  id : number,
  name : string,
  likes : Listener[],
  genre : Genre,
  performer : Performer,
  album : Album,
  image : string,
  audio_file : string,
  duration : Date
}
