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

  constructor(private router : Router, private http: HttpClient) {

    if (typeof window !== 'undefined'){
      // monkey patching fetch
      const { fetch: originalFetch } = window;

      window.fetch = async (...args) => {
        let [resource, config ] = args;

        // REQUEST INTERCEPTOR (add JWT token if it exists and is valid)
        let access_token : string | null = localStorage.getItem("access")
        try {
          console.log("REQUEST INTERCEPTOR")

          if (access_token !== null){
            if (this.authService.helper.isTokenExpired(access_token)){
              // if access token is expired renew it
              const url: string = baseURL + "auth/refresh";
              // use http post instead of fetch because that would also be intercepted
              await firstValueFrom(this.http.post<AuthResponse>(url, {}, {withCredentials: true})).then((authResponse : AuthResponse) => {
                console.log("token refreshed")
                console.log(access_token)
                // success refreshing token -> update local storage
                this.authService.setSession(authResponse)
                access_token = authResponse.access
              })
            }


            console.log(access_token)
            if (!config){
              console.log("CALLED 1")
              config = { headers: new Headers({"Authorization": `Bearer ${access_token}`}) };
            }else if(!config.headers){
              console.log("CALLED 2")
              config.headers = new Headers({"Authorization": `Bearer ${access_token}`})
            }else{
              console.log("CALLED 3")
              // check this again
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
        // RESPONSE INTERCEPTOR here

        return response;
      };
    }
  }

  showNavBar() : boolean{
    return !this.router.url.includes('auth')
  }
}
