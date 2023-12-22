import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {AuthService} from "./auth.service";
import {authGuard} from "./auth.guard";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Music Streaming';
  authService : AuthService = inject(AuthService);

  constructor(private router : Router) {

    if (typeof window !== 'undefined'){
      // monkey patching fetch
      const { fetch: originalFetch } = window;

      window.fetch = async (...args) => {
        let [resource, config ] = args;

        // REQUEST INTERCEPTOR (add JWT token if it exists and is valid)
        const access_token : string | null = localStorage.getItem("access")
        try {
          if (access_token && this.authService.helper.decodeToken(access_token)){
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
