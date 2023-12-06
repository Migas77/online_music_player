import {Performer} from "./Performer";

export interface Album{
  id : number,
  release_date : Date,
  image : string,
  performer : Performer
}
