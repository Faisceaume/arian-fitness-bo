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
  fileUrl: string;
  currentUser: User;

  constructor(private firestore: AngularFirestore,
              private router: Router,
              private store: AngularFireStorage) { }

  createUser(user: User): void {
    this.getSingleUser(user.email).then((item: User) => {
      // this.router.navigate(['/users/user-details', item.id]);
      this.asError = true;
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
    this.firestore.doc('users/' + user.id).delete();
  }


  // SECTION IMAGE

  uploadFile(file: File) {
    return new Promise<any>((resolve, reject) => {
        const uniqueFileName = Date.now().toString();

        const  upload =  this.store.storage.ref().child('usersImages/' + uniqueFileName + file.name).put(file);

        upload.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, (error) => {
            console.log('erreur de chargement... ' + error);
            reject();
          }, () => {
            upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                resolve(downloadURL);
            });
          });
    });
  }

  deletePhoto(url: string) {
    const storageRef =  this.store.storage.refFromURL(url);
    storageRef.delete().then(
              () => {
                console.log('photo supprimée');
              }
            ).catch(
              (error) => {
                console.log('Erreur de la suppression ' + error);
              }
            );
    if (this.currentUser) {
      this.newUpdateVersion(this.currentUser, 'photo', null);
    }
  }

  setFileUrl(url: string) {
    this.fileUrl = url;
    if (this.currentUser) {
      this.newUpdateVersion(this.currentUser, 'photo', url);
    }
  }
}
