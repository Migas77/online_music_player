import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  // user might have refreshed the page -> check if it's logged in
  if (!authService.isLoggedIn)
    authService.isLoggedIn = authService.IsLoggedIn()
  if (!authService.isLoggedIn)
    return inject(Router).navigate(["/auth"]);
  return authService.isLoggedIn
};
