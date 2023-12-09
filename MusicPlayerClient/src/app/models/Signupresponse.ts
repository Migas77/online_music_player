import {Signresponse} from "./Signresponse";
import {Signup} from "./Signup";

export interface Signupresponse extends Signresponse{
  // error messages generated by django (email -> errors related to email attribute and so on)
  email : string,
  username : string,
  password : string,
}
