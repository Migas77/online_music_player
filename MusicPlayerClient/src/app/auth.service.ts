import { Injectable } from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {Signinresponse} from "./models/Signinresponse";
import {Signupresponse} from "./models/Signupresponse";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL : string = "http://localhost:8000/ws/auth/";
  private token : null | string = null

  constructor() { }

  async signin(user: Signin): Promise<Signinresponse>{
    const url: string = this.baseURL + "sign-in";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    return data.json();
  }

  async signup(user: Signup): Promise<Signupresponse>{
    const url: string = this.baseURL + "sign-up";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    return await data.json();
  }
}
