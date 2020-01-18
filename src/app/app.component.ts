import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'arian-fitness-bo';
  isAuthentification: boolean;

constructor(private authService: AuthService,
            private afauth: AngularFireAuth) {

  }

  ngOnInit(): void {
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
