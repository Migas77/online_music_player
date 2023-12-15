import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Signupresponse} from "../models/Signupresponse";
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
  auth_errors! : { [key: string] : string } | Signupresponse


  constructor(private formBuilder: FormBuilder, private router : Router) { }

  signin(): void{
    const attrs = this.signin_form.value;
    if (attrs.username && attrs.password){
      this.authService.signin({username : attrs.username, password: attrs.password})
        .then(response => void this.router.navigate(['']) )
        .catch(error => this.auth_errors = JSON.parse(error.message))
    }
  }

  signup(): void{
    const attrs = this.signup_form.value;
    if (attrs.username && attrs.email && attrs.password1 && attrs.password2){
      // verify if both passwords are the same
      if (attrs.password1 !== attrs.password2){
        this.auth_errors = { 'password' : "Given passwords don't match."};
        return
      }
      
      this.authService.signup({email: attrs.email, username : attrs.username, password: attrs.password1})
        .then(response => void this.router.navigate(['']) )
        .catch(error => this.auth_errors = JSON.parse(error.message))
    }
  }
}
