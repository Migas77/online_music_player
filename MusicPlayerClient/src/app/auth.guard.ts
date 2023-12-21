import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  console.log("AUTH GUARD")
  return inject(AuthService).IsLoggedIn()
};
