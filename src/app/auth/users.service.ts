import { Injectable } from '@angular/core';
import {Users} from './users';
import 'firebase/firestore';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: Users[];
  usersSubject = new Subject<any[]>();
  isAdministrateur: boolean;

  role: string;
  roleSubject = new Subject<string>();


  constructor(private db: AngularFirestore) {}

  emitRoleSubject() {
    this.roleSubject.next(this.role);
  }

  getAllUsers() {
    this.db.collection('users')
                  .snapshotChanges().subscribe( data => {
      this.users = data.map( e => {
        const anotherData = e.payload.doc.data() as Users;
        return {
          uid : e.payload.doc.id,
          ...anotherData
        } as Users;
      });
      this.emitUsersSubject();
    });
  }

  getSingleUser(email: string) {
    return new Promise<Users>((resolve, reject) => {
      const museums = this.db.firestore.collection('users').where('email', '==', email);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {
              uid: doc.id,
              ...doc.data()} as Users
            );
        });
      });
    });
  }


  setIsAdministrateur(value: boolean) {
    this.isAdministrateur = value;
  }

  emitUsersSubject() {
    this.usersSubject.next(this.users.slice());
  }

  getUserRole(email: string) {
    const req = this.db.firestore.collection('users').where('email', '==', email);
    return new Promise((resolve, reject) => {
      req.get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          this.role = doc.data().role as string;
          resolve(this.role);
        });
      });
    });
  }

  getUserEmail(email: string) {
    const query = this.db.firestore.collection('users').where('email', '==', email);
    return new Promise((resolve, reject) => {
      query.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            resolve( false );
          } else {
            resolve( true );
          }
      }).catch((error) => console.log(error) );
    });
  }

  createUser(mail: string, id: string) {
    this.db.firestore.collection('users').doc( id ).set({email:  mail, uid: id, origine: 'AF BO : FORM', role: 'pending'});
  }

  createUserG( mail: string, id: string) {
    return new Promise<void>((resolve, reject) => {
      console.log(mail + ' ' + id);
      this.db.collection('users').doc( id ).set({email:  mail, uid: id, origine: 'AF BO : GG', role: 'pending'});
      resolve();
    });
  }
}
