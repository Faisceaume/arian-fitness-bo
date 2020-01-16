import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuthentification: boolean;

  constructor(private authService: AuthService,
              private afauth: AngularFireAuth) { }

  ngOnInit() {
    this.afauth.auth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuthentification = true;
        } else {
          this.isAuthentification = false;
        }
      }
    );
  }

  seDeconnecter(): void {
    this.authService.signOutUser();
  }
}
