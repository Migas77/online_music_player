import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {AuthService} from "./auth.service";
import {baseURL} from "./consts";
import {AuthResponse} from "./models/AuthResponse";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, firstValueFrom, throwError} from "rxjs";
import { HttpClientModule } from '@angular/common/http';
import {constants} from "fs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Music Streaming';
  authService : AuthService = inject(AuthService);
  refreshTokenPromise! : Promise<AuthResponse>;
  // this holds any in-progress token refresh requests
  // with this single promise we synchronize multiple API calls,
  // ensuring they wait for the token refresh to complete before proceeding.
  semaphore : boolean = true;

  constructor(private router : Router, private http: HttpClient) {

    if (typeof window !== 'undefined'){
      // monkey patching fetch
      const { fetch: originalFetch } = window;

      window.fetch = async (...args) => {
        let [resource, config ] = args;

        // REQUEST INTERCEPTOR (add JWT token if it exists and is valid)
        let access_token : string | null = localStorage.getItem("access")
        try {
          if (access_token !== null){
            // quando o token tiver a 1 minuto e meio de expirar
            if (this.authService.helper.decodeToken(access_token).exp - 90 < Math.floor(Date.now() / 1000)){
              if (this.semaphore){
                this.semaphore = false;
                // if access token is expired renew it
                const url: string = baseURL + "auth/refresh";
                // use http post instead of fetch because that would also be intercepted
                this.refreshTokenPromise = firstValueFrom(this.http.post<AuthResponse>(url, {}, {withCredentials: true}))
                await this.refreshTokenPromise.then((authResponse : AuthResponse) => {
                  // success refreshing token -> update local storage
                  console.log("Refreshed Access Token")
                  localStorage.setItem("access", authResponse.access)
                  access_token = authResponse.access
                  this.semaphore = true
                })
              } else {
                await this.refreshTokenPromise.then((authResponse : AuthResponse) => {
                  access_token = authResponse.access
                })
              }
            }

            if (!config){
              config = { headers: new Headers({"Authorization": `Bearer ${access_token}`})};
            }else if(!config.headers){
              config.headers = new Headers({"Authorization": `Bearer ${access_token}`})
            }else{
              config.headers = new Headers(config.headers)
              config.headers.set("Authorization", `Bearer ${access_token}`)
            }
          }
        } catch (e) {
          // if jwt token is invalid (maybe user changed local storage) clean up and redirect
          console.log("CLEANING UP")
          this.authService.clean()
        }

        // original fetch
        const response = await originalFetch(resource, config);

        // RESPONSE INTERCEPTOR

        return response;
      };
    }
  }

  showNavBar() : boolean{
    return !this.router.url.includes('auth')
  }
}
