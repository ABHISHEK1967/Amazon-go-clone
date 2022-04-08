import { Component, OnInit } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: environment.cognitoUserPoolId,
    userPoolWebClientId: environment.cognitoAppClientId,
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
      localStorage.setItem('isUser','true')
      localStorage.setItem('email',user.attributes.email);
      this.router.navigate(['sales'])
    } catch (error) {
      console.log('error signing in', error);
      alert('Invalid Login')
    }
  }
}
