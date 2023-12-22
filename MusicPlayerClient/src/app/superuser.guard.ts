import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const superuserGuard: CanActivateFn = (route, state) => {
  console.log("SUPERUSER GUARD")
  const authService : AuthService = inject(AuthService)

  try {
    // need to update this because page may have been refreshed
    authService.updateLoggedInStatus()
    authService.updateIsSuperUserStatus()
    if (!authService.isLoggedIn || !authService.isSuperUser)
      return inject(Router).navigate(["/auth"]);
  } catch (e) {
    // if jwt token is invalid (maybe user changed local storage) clean up and redirect
    // instead I'll do that in the guard if they try to access pages they shouldn't
    authService.clean()
    return inject(Router).navigate(["/auth"]);
  }

  return true
};
