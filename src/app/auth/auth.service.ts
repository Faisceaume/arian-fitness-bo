import { Injectable, NgZone } from '@angular/core';
import { Utilisateur} from './utilisateur';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Users } from './users';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Utilisateur;

  constructor(private afauth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore, private zone: NgZone) { }

  createNewUser(mail: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afauth.auth.createUserWithEmailAndPassword(mail, password)
      .then(res => {
        resolve(res);
        const batch = this.db.firestore.batch();
        const nextId = this.db.firestore.collection('users').doc().id;
        const data = Object.assign({}, {email:  mail, uid: nextId, role: 'pending'});
        const nextDocument1 = this.db.firestore.collection('users').doc(nextId);
        batch.set(nextDocument1, data);
        batch.commit();
        /*this.router.navigate(['/']);*/
      }, err => reject(err));
    });

}

SignInUser(email: string, password: string ) {
  return new Promise<any>((resolve, reject) => {
    this.afauth.auth.signInWithEmailAndPassword(email, password)
    .then(res => {
      resolve(res);
      /*this.router.navigate(['/home']);*/
    }, err => reject(err));
  });

}

signOutUser() {
  this.afauth.auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

connectionWithGoogle(): void {
  const provider = new auth.GoogleAuthProvider();
  this.afauth.auth.signInWithPopup(provider).then(
     (result) => {
       const u = result.user;
       const item = {
         uid: u.uid,
         email: u.email
       } as Users;
       this.zone.run(() => this.router.navigate(['/home']));
     }
   );
}

}
