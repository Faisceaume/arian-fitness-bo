import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createUser(user: User): void {
    this.getSingleUser(user.email).then((item: User) => {
      console.log(item);
    }, (error) => {

    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('users').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('users').doc(currentid);
    let data = Object.assign({}, user);
    data = Object.assign(user, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/users/user-details', currentid]);
    }).catch((erreur) => { console.error('Error creating document: ', erreur); });
    });

  }

  getAllUsers() {

  }

  getSingleUser(email: string, currentId?: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let museums: any;
      if (currentId) {
        museums = this.firestore.firestore.collection('users').where('id', '==', currentId);
      } else {
        museums = this.firestore.firestore.collection('users').where('email', '==', email);
      }

      museums.get().then((querySnapshot) =>  {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            resolve(
              {id: doc.id,
                ...doc.data()} as User
              );
          });
        } else {
          reject();
        }
      });

    });
  }

  newUpdateVersion(element: User, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('users').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
