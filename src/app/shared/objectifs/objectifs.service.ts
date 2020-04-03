import { Injectable } from '@angular/core';
import { Objectif } from './objectif';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ObjectifsService {

  objectifs: Objectif[];
  objectifSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore) { }

createObjectif(objectif: Objectif): void {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('objectifs').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('objectifs').doc(currentid);
    let data = Object.assign({}, objectif);
    data = Object.assign(objectif, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
            }).catch((error) => { console.error('Error creating document: ', error); });
}

getAllObjectifs(): void {
  this.firestore.collection('objectifs', ref => ref.orderBy('nom'))
                .snapshotChanges().subscribe( data => {
    this.objectifs = data.map( e => {
      const anotherData = e.payload.doc.data() as Objectif;
      return  {
        ...anotherData
      } as Objectif;
    });
    this.emitObjectifSubject();
  });
}

getObjectifsPremium(): void {
  this.firestore.collection('objectifs', ref => ref.where('premium', '==', true).orderBy('nom'))
                .snapshotChanges().subscribe( data => {
    this.objectifs = data.map( e => {
      const anotherData = e.payload.doc.data() as Objectif;
      return  {
        ...anotherData
      } as Objectif;
    });
    this.emitObjectifSubject();
  });
}

emitObjectifSubject() {
  this.objectifSubject.next(this.objectifs.slice());
}

getSingleObjectif(id: string) {
  return new Promise<Objectif>((resolve, reject) => {
    const museums = this.firestore.firestore.collection('objectifs').where('id', '==', id);
    museums.get().then((querySnapshot) =>  {
      querySnapshot.forEach((doc) => {
        resolve(
          {id: doc.id,
            ...doc.data()} as Objectif
          );
      });
    });
  });
}

deleteObjectif(item: Objectif) {
  this.firestore.doc('objectifs/' + item.id).delete();
}

newUpdateVersion(objectif: Objectif, attribut: string, value: any) {
  const batch = this.firestore.firestore.batch();
  const nextDocument1 = this.firestore.firestore.collection('objectifs').doc(objectif.id);
  batch.update(nextDocument1, `${attribut}`, value);
  batch.commit().then(() => {
  }).catch((error) => { console.error('Error updzting document: ', error); });
}

}
