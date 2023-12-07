import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {Form, FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Signresponse} from "../models/Signresponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  authService : AuthService = inject(AuthService)
  signup_form = this.formBuilder.group({
    'email': '',
    'username': '',
    'password1': '',
    'password2' : ''
  })
  signin_form = this.formBuilder.group({
    'username': '',
    'password': '',
  })



  constructor(private formBuilder: FormBuilder, private router : Router) {
    console.log("STARTED");
  }

  signup(): void{
    console.log(this.signup_form.value);
  }

  signin(): void{
    const attrs = this.signin_form.value;
    if (attrs.username && attrs.password){
      this.authService.signin({username : attrs.username, password: attrs.password})
        .then((response : Signresponse) => {
          if (response != null)
            void this.router.navigate([''])
        })
    }

  }
}
