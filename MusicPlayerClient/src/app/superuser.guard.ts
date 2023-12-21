import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {SuperUserResponse} from "./models/SuperUserResponse";

export const superuserGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  if (authService.isSuperUser === null)
    authService.IsSuperUser().then((r : boolean) => { authService.isSuperUser = r })
  if (!authService.isSuperUser)
    return inject(Router).navigate(["/auth"]);
  return authService.isSuperUser as boolean
  // later verify if it's loggedin
};
