import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  console.log("AUTH GUARD")
  const authService : AuthService = inject(AuthService)

  try {
    // need to update this because page may have been refreshed
    authService.updateLoggedInStatus()
    if (!authService.isLoggedIn)
      return inject(Router).navigate(["/auth"]);
  } catch (e) {
    // if jwt token is invalid (maybe user changed local storage) clean up and redirect
    // instead I'll do that in the guard if they try to access pages they shouldn't
    authService.clean()
    return inject(Router).navigate(["/auth"]);
  }

  return true
};
