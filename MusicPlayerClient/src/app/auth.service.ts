import { Injectable } from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {AuthResponse} from "./models/AuthResponse";
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL : string = "http://localhost:8000/ws/auth/";
  helper : JwtHelperService = new JwtHelperService()
  isLoggedIn: boolean = false;

  constructor() {}

  IsLoggedIn(): boolean {
    console.log("IsLoggedIn")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      return false;
    }
    try {
      return this.helper.isTokenExpired(access)
    }catch (e) {
      // if jwt token is invalid (maybe user changed local storage)
      return false
    }
  }

  IsSuperUser() : boolean {
    console.log("IsSuperUser")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      return false;
    }
    try {
      return this.helper.decodeToken(access).is_superuser
    }catch (e) {
      // if jwt token is invalid (maybe user changed local storage)
      return false
    }
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
    console.log(this.helper.decodeToken(localStorage.getItem("access") as string))
    const url: string = this.baseURL + "sign-out";
    const data: Response = await fetch(url, {
      method: 'POST'
    });
    // if (data.status !== 201)
    // throw new Error(JSON.stringify(await data.json()))
    localStorage.clear();
    this.isLoggedIn = false;
  }

  private setSession(authResponse : AuthResponse){
    console.log(authResponse)
    localStorage.setItem("access", authResponse.access);
    this.isLoggedIn = true
  }

}
