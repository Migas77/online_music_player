import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  // user might have refreshed the page and reseted saved isLoggedIn variable of the service -> check if it's logged in
  if (!authService.isLoggedIn)
    authService.isLoggedIn = authService.IsLoggedIn() // see if it's login via the token
  if (!authService.isLoggedIn)
    return inject(Router).navigate(["/auth"]);
  return authService.isLoggedIn
};
