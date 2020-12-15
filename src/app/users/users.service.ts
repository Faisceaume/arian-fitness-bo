import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[];
  userSubject = new Subject<any[]>();
  asError: boolean;

  currentUser: User;

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createUser(user: User): void {
    this.getSingleUser(user.email).then((item: User) => {
      // this.router.navigate(['/users/user-details', item.id]);
      this.asError = true;
    }, (error) => {

    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('users').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('users').doc(currentid);
    let data = Object.assign({}, user);
    data = Object.assign(user, {id: currentid, origine: 'AF BO : USR SIMULATION', timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/users/user-details', currentid]);
    }).catch((erreur) => { console.error('Error creating document: ', erreur); });
    });

  }

  getAllUsers() {
        this.firestore.collection('users', ref => ref.orderBy('timestamp'))
                  .snapshotChanges().subscribe( data => {
       this.users = data.map( e => {
        const anotherData = e.payload.doc.data() as User;
        return  {
          ...anotherData
        } as User;
      });
       this.emitUserSubject();
    });
  }

  emitUserSubject() {
    this.userSubject.next(this.users.slice());
}

  getSingleUser(email: string, currentId?: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let userurl: any;
      if (currentId) {
        userurl = this.firestore.firestore.collection('users').where('id', '==', currentId);
      } else {
        userurl = this.firestore.firestore.collection('users').where('email', '==', email);
      }

      userurl.get().then((querySnapshot) =>  {
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

  deleteUser(user: User) {
    const batch = this.firestore.firestore.batch();
    let query = this.firestore.firestore.collection('users').doc(user.id).collection('notifications');
    let ref2 = this.firestore.firestore.collection('users').doc(user.id);
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let ref = this.firestore.firestore.collection('users').doc(user.id).collection('notifications').doc(doc.id)
        batch.delete( ref );
      })
    }).finally(() => {
      batch.delete(ref2);
      batch.commit().then(() => console.log('User supprimé avec succès'))
                    .catch(error => console.log('Erreur supression user' ,error))
    });
  }
}
