import {Injectable, OnInit} from '@angular/core';
import {Signin} from "./models/Signin";
import {Signup} from "./models/Signup";
import {AuthResponse} from "./models/AuthResponse";
import {JwtHelperService} from "@auth0/angular-jwt";
import {BASE_URL} from "./consts";


@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private baseURL : string = BASE_URL + "auth/";
  helper : JwtHelperService = new JwtHelperService()
  isLoggedIn!: boolean;
  isSuperUser!: boolean;
  userId! : number;

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
    console.log("updateLoggedInStatus")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      this.isLoggedIn = false;
    } else {
      // if jwt token is invalid (maybe user changed local storage)
      // the exception will have to be caught outside the function
      this.userId = this.helper.decodeToken(access).user_id;
      this.isLoggedIn = true
    }
  }

  updateIsSuperUserStatus() : void {
    console.log("updateIsSuperUserStatus")
    const access: string | null = localStorage.getItem("access")
    if (access===null) {
      this.isSuperUser = false;
    } else {
      // if jwt token is invalid (maybe user changed local storage)
      // the exception will have to be caught outside the function
      this.isSuperUser = this.helper.decodeToken(access).is_superuser
    }
  }

  setSession(authResponse : AuthResponse){
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
      method: 'POST', credentials: "include", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    // credentials include -> save http only cookie
    if (data.status !== 200)
      throw new Error(JSON.stringify(await data.json()))
    localStorage.clear()
    this.setSession(await data.json());
  }

  async signup(user: Signup): Promise<void>{
    const url: string = this.baseURL + "sign-up";
    const data: Response = await fetch(url, {
      method: 'POST', credentials: "include", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
    });
    // credentials include -> save http only cookie
    if (data.status !== 201)
      throw new Error(JSON.stringify(await data.json()))
    localStorage.clear()
    this.setSession(await data.json());
  }

}
