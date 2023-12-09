import {Signresponse} from "./Signresponse";
import {Signup} from "./Signup";

export interface Signinresponse extends Signresponse{
  non_field_errors : string[]
}
