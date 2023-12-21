import {SuperUserResponse} from "./SuperUserResponse";

export interface AuthResponse extends SuperUserResponse{
  access : string,
  expiry : string,
}
