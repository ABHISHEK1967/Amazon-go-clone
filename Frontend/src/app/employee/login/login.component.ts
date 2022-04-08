import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Amplify, { Auth } from 'aws-amplify';
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async signIn(this: any) {
    try {
      const user = await Auth.signIn(this.email,this.password);
      console.log(user)
      localStorage.setItem('isEmployee','true')
      this.router.navigate(['employee/purchase'])
    } catch (error) {
      console.log('error signing in', error);
      alert('Invalid Login')
    }
  }
}
