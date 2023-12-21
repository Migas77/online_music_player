import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Music Streaming';


  constructor(private router : Router) {
    if (typeof window !== 'undefined'){
      // monkey patching fetch
      const { fetch: originalFetch } = window;

      window.fetch = async (...args) => {
        let [resource, config ] = args;

        // REQUEST INTERCEPTOR (add JWT token if it exists)
        const access_token : string | null = localStorage.getItem("access")
        if (access_token){
          if (!config){
            config = { headers: new Headers({"Authorization": `Bearer ${access_token}`}) };
          }else if(!config.headers){
            config.headers = new Headers({"Authorization": `Bearer ${access_token}`})
          }else{
            // check this again
            config.headers = new Headers(config.headers)
            config.headers.set("Authorization", `Bearer ${access_token}`)
          }
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
