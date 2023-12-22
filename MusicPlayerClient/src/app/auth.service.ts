import {Injectable, OnInit} from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {AuthResponse} from "./models/AuthResponse";
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private baseURL : string = "http://localhost:8000/ws/auth/";
  helper : JwtHelperService = new JwtHelperService()
  isLoggedIn!: boolean;
  isSuperUser!: boolean;

  constructor() {
    try {
      console.log("CONSTRUCTOR AUTH SERVICE")
      // need to update this because page may have been refreshed
      // I want to change some navbar icons based on if the user is logged in or if it's superUser
      this.updateLoggedInStatus()
      this.updateIsSuperUserStatus()
    } catch (e) {
      // if jwt token is invalid (maybe user changed local storage) clean up
      // I don't redirect here because I want the users to use the pages which don't require authentication
      // instead I'll do that in the guard if they try to access pages they shouldn't
      this.isLoggedIn = false;
      this.isSuperUser = false;
      // didn't clean local storage because it was giving undefined in constructor (this as no impact on security)
    }
  }

  updateLoggedInStatus() : void {
    console.log("IsLoggedIn")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      this.isLoggedIn = false;
    } else {
      // if jwt token is invalid (maybe user changed local storage)
      // the exception will have to be caught outside the function
      this.isLoggedIn = !this.helper.isTokenExpired(access)
    }
  }

  updateIsSuperUserStatus() : void {
    console.log("IsSuperUser")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      this.isSuperUser = false;
    } else {
      // if jwt token is invalid (maybe user changed local storage)
      // the exception will have to be caught outside the function
      this.isSuperUser = this.helper.decodeToken(access).is_superuser
    }
  }

  private setSession(authResponse : AuthResponse){
    console.log(authResponse)
    localStorage.setItem("access", authResponse.access);
    this.isLoggedIn = true
    this.isSuperUser = this.helper.decodeToken(authResponse.access).is_superuser
  }

  clean() : void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.isSuperUser = false;
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

}
