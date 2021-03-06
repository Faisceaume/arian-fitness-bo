import { Injectable, NgZone } from '@angular/core';
import { Utilisateur} from './utilisateur';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Users } from './users';
import { auth } from 'firebase/app';
import { UsersService } from './users.service';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Utilisateur;
  isConnected = false;
  isAdmin: boolean;
  isAdminSubject = new Subject<boolean>();

  constructor(private afauth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore,
              private zone: NgZone,
              private userService: UsersService) { }

  emitIsAdmin(isAdmins: boolean) {
    this.isAdminSubject.next(isAdmins);
  }

  createNewUser(mail: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afauth.auth.createUserWithEmailAndPassword(mail, password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  SignInUser(email: string, password: string ) {
    return new Promise<any>((resolve, reject) => {
      this.afauth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
        this.isConnected = true;
        /*this.router.navigate(['/home']);*/
      }, err => reject(err));
    });

  }

  signOutUser() {
    this.afauth.auth.signOut().then(() => {
      this.isAdmin = false;
      this.isConnected = false;
      this.emitIsAdmin(this.isAdmin);
    }).catch((error) => {
    });
  }

  async getUser() {
    return this.afauth.authState.pipe(first()).toPromise();
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return new Promise<any>((resolve, reject) => {
      this.afauth.auth.signInWithPopup(provider).then(
        (result) => {
          const u = result.user;
          /*this.userService.createUser(u.email);*/
          this.isConnected = true;
          resolve(result.user);
          /*this.zone.run(() => this.router.navigate(['/home']));*/
        }
      );
    });
  }
}
