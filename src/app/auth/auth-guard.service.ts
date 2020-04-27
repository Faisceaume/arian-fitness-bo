import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
     private us: UsersService,
     private router: Router,
     private afauth: AngularFireAuth,
     private authService: AuthService,
     private ngZone: NgZone ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) => {
      this.afauth.auth.onAuthStateChanged(
        (user) => {
          if (user) {
            this.us.getUserRole(user.email).then((item: string) => {
              if (item === 'admin') {
                this.authService.isAdmin = true;
                resolve(true);
              } else {
                this.authService.isAdmin = false;
                this.ngZone.run(() => this.router.navigate(['/auth']));
                resolve(false);
              }
            });
          } else {
            this.authService.isAdmin = false;
            this.ngZone.run(() => this.router.navigate(['/auth']));
            resolve(false);
          }
        }
      );
    });
  }
}
