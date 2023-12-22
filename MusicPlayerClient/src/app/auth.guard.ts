import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  try {
    // user might have refreshed the page and reset saved isLoggedIn variable of the service
    // user might have changed jwt in localStorage
    authService.updateLoggedInStatus()
    if (!authService.isLoggedIn)
      return inject(Router).navigate(["/auth"]);
  } catch (e) {
    // if jwt token is invalid (maybe user changed local storage) clean up and redirect
    authService.clean()
    return inject(Router).navigate(["/auth"]);
  }
  return true
};
