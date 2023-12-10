import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Signupresponse} from "../models/Signupresponse";
import {Signinresponse} from "../models/Signinresponse";
import {NgForOf, NgIf, CommonModule} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CommonModule
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
  error_messages : string[] = []


  constructor(private formBuilder: FormBuilder, private router : Router) { }

  signin(): void{
    const attrs = this.signin_form.value;
    if (this.error_messages.length === 0 && attrs.username && attrs.password){
      this.authService.signin({username : attrs.username, password: attrs.password})
        .then((response : Signinresponse) => {
          if (!response.non_field_errors){
            void this.router.navigate(['']);
          }else{
            this.error_messages = response.non_field_errors;
          }
        })
    }
  }

  signup(): void{
    const attrs = this.signup_form.value;
    if (this.error_messages.length === 0 && attrs.username && attrs.email && attrs.password1 && attrs.password2){
      if (attrs.password1 !== attrs.password2){
        this.error_messages = ["Given passwords don't match."];
        return
      }
      // verify if both passwords are the same
      this.authService.signup({email: attrs.email, username : attrs.username, password: attrs.password1})
        .then((response : Signupresponse) => {
          if (!response.email && !response.username && !response.password){
            void this.router.navigate(['']);
          }else{
            this.error_messages = this.error_messages.concat(response.email).concat(response.username).concat(response.password);
            console.log(response.email)
            console.log(response.username)
            console.log(response.password)
            console.log(this.error_messages)
          }
        })
    }
  }

  reset_error_messages() : void {
    this.error_messages = []
  }


}
