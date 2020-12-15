import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications: any[];
  private notificationOne: any;
  notificationsSubject = new Subject<any[]>();
  notificationOneSubject = new Subject<any>();
  

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }

  ///////////////////////////////////////////////
  ///////////////// EMIT ////////////////////////
  //////////////////////////////////////////////
  emitNotificationsSubject() {
    this.notificationsSubject.next( this.notifications );
  }

  emitNotificationOneSubject() {
    this.notificationOneSubject.next( this.notificationOne );
  }


  ////////////////////////////////////////////////////
  /////////////////// GET ////////////////////////////
  ///////////////////////////////////////////////////
  getAllNotifications() {
    this.db.collection('notifications', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().subscribe(array => {
      this.notifications = array.map(e => { return e.payload.doc.data() });
      this.emitNotificationsSubject();
    });
  }

  getOneNotification(id: string) {
    this.db.collection('notifications').doc( id ).get().subscribe(d => {
      this.notificationOne = {
        id: d.data().id,
        timestamp: d.data().timestamp,
        title: d.data().title,
        content: d.data().content,
        status: d.data().status,
        image: d.data().image 
      };
      this.emitNotificationOneSubject();
    });
  }


  /////////////////////////////////////////////////////
  ///////////////// CREATE ///////////////////////////
  ////////////////////////////////////////////////////
  createNotification(data: any) {
    const batch = this.db.firestore.batch();
    const key = this.db.createId();
    const username = this.afAuth.auth.currentUser.displayName;
    const userid = this.afAuth.auth.currentUser.uid;
    const newData = Object.assign(data, {id: key, timestamp: new Date().getTime()}, {username: username, userid: userid});
    const ref = this.db.firestore.collection('notifications').doc(key);
    
    const query = this.db.firestore.collection('users');
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const ref2 = this.db.firestore.collection('users').doc(doc.id).collection('notifications').doc(key);
        batch.set(ref2, newData);
      });
      batch.set(ref, newData);   
      batch.commit().then(() => console.log('Nouvelle notification crée avec succès '))
                  .catch((err) => console.log('Erreur à la création de notification' + err));
    });
    
  }


  ///////////////////////////////////////////////////
  //////////////// UPDATE ///////////////////////////
  ///////////////////////////////////////////////////
  updateNotification(data: any, id: string) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('notifications').doc(id);

    const query = this.db.firestore.collection('users');
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const ref2 = this.db.firestore.collection('users').doc(doc.id).collection('notifications').doc(id);
        batch.update(ref2, {
          timestamp: new Date().getTime(),
          title: data.title,
          content: data.content,
          status: data.status
        });
      });
      batch.update(ref, {
        timestamp: new Date().getTime(),
        title: data.title,
        content: data.content,
        status: data.status
      });
      batch.commit().then(() => console.log('Mise a jour de statut réussi'))
                  .catch(err => console.log('Erreur de la mise à jour notification' + err));
    });


    
    
  }

  updateStatusNotification(newStatus: string, id: string) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('notifications').doc(id);
    const query = this.db.firestore.collection('users');
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const ref2 = this.db.firestore.collection('users').doc(doc.id).collection('notifications').doc(id); 
        batch.update(ref2, { status: newStatus });
      });
      batch.update(ref, { status: newStatus });
      return batch.commit().then(() => console.log('notification status change to ' + newStatus))
      .catch(err => console.log('Erreur mise à jour du statut' + err));
    });
  }

  newUpdateVersion(element: any, attribut: string, value: any) {
    const batch = this.db.firestore.batch();
    const nextDocument1 = this.db.firestore.collection('notifications').doc(element.id);
    const query = this.db.firestore.collection('users');
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const ref2 = this.db.firestore.collection('users').doc(doc.id).collection('notifications').doc(element.id); 
        batch.update(ref2, `${attribut}`, value);
      });
      batch.update(nextDocument1, `${attribut}`, value);
      batch.commit().then(() => {
      }).catch((error) => { console.error('Error updating document: ', error); });
    });
  }


  ///////////////////////////////////////////////////
  ///////////////// DELETE //////////////////////////
  ///////////////////////////////////////////////////
  deleteNotification(id: string) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('notifications').doc(id);

    const query = this.db.firestore.collection('users');
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const ref2 = this.db.firestore.collection('users').doc(doc.id).collection('notifications').doc(id);
        batch.delete(ref2);
      });
      batch.delete(ref);   
      batch.commit().then(() => console.log('Notification (' + id +  ') supprimée'))
                  .catch((err) => console.log('Erreur à la suppression de la notification' + err));
    });
  }
}
