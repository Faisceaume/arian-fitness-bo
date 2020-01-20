import { Component, OnInit } from '@angular/core';
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

  userRegister = {
    member: '',
    email : '',
    password : '',
  };

  userSingUp = {
    email : '',
    password : ''
  };

  constructor(private userService: UsersService, private authService: AuthService, private route: Router) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    const data = form.value;
    if (form.valid) {
      this.authService.createNewUser(data.email, data.password)
      .then(res => {
        console.log(res);
        this.errorMessageInscription = '';
        this.route.navigate(['/auth']);
      }, err => {
       this.errorMessageInscription = err;
      });
    }

  }


  onSubmit2() {
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
          this.authService.signOutUser();
          return;
        }
      });
    }, err => {
      this.errorMessageConnexion = err;
    });
  }

  connectionWithGoogle() {
    const promesse = new Promise((resolve, reject) => {
      this.authService.connectionWithGoogle();
      resolve();
    });

    promesse.then(() => {
      this.route.navigate(['/home']);
    });
  }

}
