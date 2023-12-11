import {Performer} from "./Performer";

export interface Album{
  id : number,
  name : string,
  release_date : Date,
  image : string,
  performer : Performer
}
