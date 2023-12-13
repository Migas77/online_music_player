import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Signupresponse} from "../models/Signupresponse";
import {Signinresponse} from "../models/Signinresponse";
import {NgForOf, NgIf, CommonModule} from "@angular/common";
import {ErrorDisplayComponent} from "../error-display/error-display.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CommonModule,
    ErrorDisplayComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  authService : AuthService = inject(AuthService)
  signup_form : FormGroup = this.formBuilder.group({
    'email': '',
    'username': '',
    'password1': '',
    'password2' : ''
  })
  signin_form : FormGroup = this.formBuilder.group({
    'username': '',
    'password': '',
  })
  auth_errors : string[] = []


  constructor(private formBuilder: FormBuilder, private router : Router) { }

  signin(): void{
    const attrs = this.signin_form.value;
    if (attrs.username && attrs.password){
      this.authService.signin({username : attrs.username, password: attrs.password})
        .then((response : Signinresponse) => {
          if (!response.non_field_errors){
            void this.router.navigate(['']);
          }else{
            this.auth_errors = response.non_field_errors;
          }
        })
    }
  }

  signup(): void{
    const attrs = this.signup_form.value;
    if (attrs.username && attrs.email && attrs.password1 && attrs.password2){
      if (attrs.password1 !== attrs.password2){
        console.log(this.auth_errors)
        this.auth_errors = ["Given passwords don't match."];
        return
      }
      // verify if both passwords are the same
      this.authService.signup({email: attrs.email, username : attrs.username, password: attrs.password1})
        .then((response : Signupresponse) => {
          if (!response.email && !response.username && !response.password){
            void this.router.navigate(['']);
          }else{
            this.auth_errors = [response.email, response.username, response.password].filter(val => val !== undefined);
            console.log(this.auth_errors)
          }
        })
    }
  }
}
