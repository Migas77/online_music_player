import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService : AuthService = inject(AuthService)

  constructor(private router : Router) { }

  signout() {
    this.authService.clean();
    void this.router.navigate(['/auth'])
  }
}
