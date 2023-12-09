import {ChangeDetectorRef, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
import {Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Signresponse} from "../models/Signresponse";
import {Router} from "@angular/router";
import {Sign} from "crypto";
import {Signupresponse} from "../models/Signupresponse";
import {Signinresponse} from "../models/Signinresponse";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
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


  constructor(private formBuilder: FormBuilder, private router : Router) {
    console.log("STARTED");
  }

  signin(): void{
    const attrs = this.signin_form.value;
    if (attrs.username && attrs.password){
      this.authService.signin({username : attrs.username, password: attrs.password})
        .then((response : Signinresponse) => {
          if (!response.non_field_errors){
            void this.router.navigate(['']);
          }else{
            this.error_messages = response.non_field_errors
            console.log(this.error_messages)
          }
        })
    }
  }

  signup(): void{
    const attrs = this.signup_form.value;
    console.log("signup")
    if (attrs.username && attrs.email && attrs.password1 && attrs.password2){
      // verify if both passwords are the same
      this.authService.signup({email: attrs.email, username : attrs.username, password: attrs.password1})
        .then((response : Signupresponse) => {

        })
    }
  }


}
