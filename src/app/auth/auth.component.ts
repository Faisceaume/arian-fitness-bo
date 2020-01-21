import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  errorMessageConnexion = '';
  errorMessageInscription = '';
  roleProperty = '';
  isRegisterLoad = false;
  isRegistered = false;
  isGoogleRegistered = false;

  userRegister = {
    member: '',
    email : '',
    password : '',
  };

  userSingUp = {
    email : '',
    password : ''
  };

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private route: Router,
    private zone: NgZone ) { }

  ngOnInit() {

  }

  signUp(form: NgForm) {
    const data = form.value;
    if (form.valid) {
      this.isRegisterLoad = true;
      this.authService.createNewUser(data.email, data.password)
      .then(res => {
        this.isRegistered = true;
        this.isRegisterLoad = false;
        console.log(res);
        this.errorMessageInscription = '';
        /*this.authService.signOutUser();*/
      }, err => {
       this.isRegisterLoad = false;
       this.errorMessageInscription = err;
      });
    }
  }

  signIn() {
    this.authService.SignInUser(this.userSingUp.email, this.userSingUp.password)
    .then(res => {
      console.log(res);
      this.errorMessageConnexion = '';
      this.userService.getUserRole(this.userSingUp.email).then((role: string) => {
        this.roleProperty = role;
        if (this.roleProperty === 'admin') {
          this.route.navigate(['/home']);
          this.errorMessageConnexion = '';
        } else {
          this.errorMessageConnexion = 'Vous n\'êtes pas administrateur';
          this.authService.isConnected = false;
          this.authService.signOutUser();
          return;
        }
      });
    }, err => {
      this.errorMessageConnexion = err;
    });
  }

  signInWithGoogle() {
    const promesse = new Promise((resolve, reject) => {
      this.authService.connectionWithGoogle();
      resolve();
    });

    promesse.then(() => {
      this.route.navigate(['/home']);
    });
  }

}
