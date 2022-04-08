import { Component, OnInit } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: environment.cognitoEmpUserPoolId,
    userPoolWebClientId: environment.cognitoEmpAppClientId,
  }
});

// You can get the current config object
const currentConfig = Auth.configure();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username: string = ""
  email: string = ""
  password: string = ""
  cPassword: string = ""

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async signUp() {
    const { user } = await Auth.signUp({
      username: this.email,
      password: this.password,
      attributes: {
      }
    });
    console.log(user)
    this.router.navigate(['employee/login']);
  }
}
