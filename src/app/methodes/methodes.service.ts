import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Methode } from './methode';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MethodesService {

  methodes: Methode[];
  methodeSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

createMethode(methode: Methode): void {
    const batch = this.firestore.firestore.batch();

    const currentid = this.firestore.firestore.collection('methodes').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('methodes').doc(currentid);

    let data = Object.assign({}, methode);
    data = Object.assign(methode, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/methodes', currentid]);
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

getAllMethodes(): void {
    this.firestore.collection('methodes', ref => ref.orderBy('nom'))
                  .snapshotChanges().subscribe( data => {
       this.methodes = data.map( e => {
        const anotherData = e.payload.doc.data() as Methode;
        return  {
          ...anotherData
        } as Methode;
      });
       this.emitMethodeSubject();
    });
}

emitMethodeSubject() {
    this.methodeSubject.next(this.methodes.slice());
}


getSingleMethode(id: string) {
    return new Promise<Methode>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('methodes').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Methode
            );
        });
      });
    });
  }

deleteMethode(methode: Methode) {
    this.firestore.doc('methodes/' + methode.id).delete();
  }

newUpdateVersion(element: Methode, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('methodes').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
