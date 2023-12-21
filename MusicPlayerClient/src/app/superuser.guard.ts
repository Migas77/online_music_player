import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const superuserGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  if (!authService.IsSuperUser())
    return inject(Router).navigate(["/auth"]);
  return true
  // later verify if it's logged in
};
