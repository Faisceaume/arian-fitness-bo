import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  userRegister = {
    member: '',
    email : '',
    password : '',
  };

  userSingUp = {
    email : '',
    password : ''
  };

  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    const data = form.value;
    if (form.valid) {
      this.authService.createNewUser(data.email, data.password)
      .then(res => {
        console.log(res);
        this.route.navigate(['/auth']);
      }, err => {
       alert(err);
      });
    }

  }


  onSubmit2() {
    this.authService.SignInUser(this.userSingUp.email, this.userSingUp.password)
    .then(res => {
      console.log(res);
      this.route.navigate(['/home'])
    }, err => {
      alert(err);
    });
  }

  connectionWithGoogle() {
    this.authService.connectionWithGoogle();
    this.route.navigate(['/home'])
  }

}
