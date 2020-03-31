import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Aliment } from './aliment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlimentsService {

  aliments: Aliment[];
  alimentsSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createAliment(aliment: Aliment) {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('aliments').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('aliments').doc(currentid);
    let data = Object.assign({}, aliment);
    data = Object.assign(aliment, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      this.router.navigate(['/aliments', currentid]);
            }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllAliments(): void {
    this.firestore.collection('aliments', ref => ref.orderBy('nom'))
                .snapshotChanges().subscribe( data => {
    this.aliments = data.map( e => {
      const anotherData = e.payload.doc.data() as Aliment;
      return  {
        ...anotherData
      } as Aliment;
    });
    this.emitAlimentSubject();
  });
  }

  emitAlimentSubject() {
    this.alimentsSubject.next(this.aliments.slice());
  }

  getSingleAliment(id: string) {
    return new Promise<Aliment>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('aliments').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Aliment
            );
        });
      });
    });
  }

  deleteAliment(id: string) {
    this.firestore.doc('aliments/' + id).delete();
  }

  newUpdateVersion(element: Aliment, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('aliments').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
