import { Injectable } from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {Signupresponse} from "./models/Signupresponse";
import {AuthResponse} from "./models/AuthResponse";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL : string = "http://localhost:8000/ws/auth/";

  constructor() { }

  async signin(user: Signin): Promise<void> {
    const url: string = this.baseURL + "sign-in";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    if (data.status != 200)
      throw new Error(JSON.stringify(await data.json()))
    const authResponse : AuthResponse = await data.json()
    localStorage.setItem("access", authResponse.access)
    console.log(localStorage.getItem("access"))
  }

  async signup(user: Signup): Promise<void>{
    const url: string = this.baseURL + "sign-up";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    if (data.status != 201)
      throw new Error(JSON.stringify(await data.json()))
    const authResponse : AuthResponse = await data.json()
    localStorage.setItem("access", authResponse.access)
  }

  async signout(): Promise<void>{
    const url: string = this.baseURL + "sign-out";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {
        "Authorization": `Bearer ${localStorage.getItem("access") as string}`
      }
    });
    // if (data.status != 201)
    // throw new Error(JSON.stringify(await data.json()))
    localStorage.clear()
  }
}
