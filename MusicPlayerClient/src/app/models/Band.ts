import {Performer} from "./Performer";
import {Artist} from "./Artist";

export interface Band extends Performer{
  members : Artist[]
}
