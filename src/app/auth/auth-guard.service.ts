import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
/*import * as firebase from 'firebase/app';*/

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
     private router: Router,
     private afauth: AngularFireAuth,
     private authService: AuthService,
     private ngZone: NgZone ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) => {
      this.afauth.auth.onAuthStateChanged(
        (user) => {
          if (user) {
            resolve(true);
          } else {
            this.ngZone.run(() => this.router.navigate(['/auth']));
            resolve(false);
          }
        }
      );
    });
  }
}
