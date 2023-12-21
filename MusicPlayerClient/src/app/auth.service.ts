import { Injectable } from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {AuthResponse} from "./models/AuthResponse";
import {SuperUserResponse} from "./models/SuperUserResponse";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL : string = "http://localhost:8000/ws/auth/";
  isSuperUser: boolean | null = null;
  isLoggedIn: boolean | null = null;

  constructor() {
    //this.isLoggedIn = this.IsLoggedIn()
    //this.IsSuperUser()
    //  .then((res : boolean) => this.isSuperUser = res)
  }

  IsLoggedIn(): boolean {
    console.log("LOG IN")
    const expiry: string | null = localStorage.getItem("expiry");
    if (expiry === null) {
      return false;
    }
    return Date.now() < parseInt(expiry);
  }

  async IsSuperUser() : Promise<boolean>{
    console.log("SUPERUSER")
    // Obviously, for security reasons I'm not going to save the role of the user in the localStorage
    // saved in memory (if user refreshes page we do another api call to find out if it's superUser)
    const url: string = this.baseURL + "get-role";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json()
  }

  async signin(user: Signin): Promise<void> {
    const url: string = this.baseURL + "sign-in";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    if (data.status !== 200)
      throw new Error(JSON.stringify(await data.json()))
    this.setSession(await data.json());
  }

  async signup(user: Signup): Promise<void>{
    const url: string = this.baseURL + "sign-up";
    const data: Response = await fetch(url, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    if (data.status !== 201)
      throw new Error(JSON.stringify(await data.json()))
    this.setSession(await data.json());
  }

  async signout(): Promise<void>{
    const url: string = this.baseURL + "sign-out";
    const data: Response = await fetch(url, {
      method: 'POST'
    });
    // if (data.status !== 201)
    // throw new Error(JSON.stringify(await data.json()))
    localStorage.clear();
    this.isSuperUser = null;
  }

  private setSession(authResponse : AuthResponse){
    console.log(authResponse)
    localStorage.setItem("access", authResponse.access);
    localStorage.setItem("expiry", authResponse.expiry);
    this.isSuperUser = authResponse.isSuperUser
  }

}
