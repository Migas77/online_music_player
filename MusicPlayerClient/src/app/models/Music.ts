import {Genre} from "./Genre";
import {Performer} from "./Performer";
import {Album} from "./Album";

export interface Music{
  id : number,
  likes : Genre[],
  performer : Performer,
  album : Album,
  image : string,
  audio_file : string
}
