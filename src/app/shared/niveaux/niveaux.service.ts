import { Injectable } from '@angular/core';
import { Niveau } from './niveau';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NiveauxService {

  niveaux: Niveau[];
  niveauxSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore) { }


createNiveaux(niveau: Niveau): void {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('niveaux').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('niveaux').doc(currentid);
    let data = Object.assign({}, niveau);
    data = Object.assign(niveau, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
            }).catch((error) => { console.error('Error creating document: ', error); });
}

getAllNiveaux(): void {
  this.firestore.collection('niveaux', ref => ref.orderBy('nom'))
                .snapshotChanges().subscribe( data => {
    this.niveaux = data.map( e => {
      const anotherData = e.payload.doc.data() as Niveau;
      return  {
        ...anotherData
      } as Niveau;
    });
    this.emitNiveauxSubject();
  });
}

emitNiveauxSubject() {
this.niveauxSubject.next(this.niveaux.slice());
}

getSingleNiveau(id: string) {
  return new Promise<Niveau>((resolve, reject) => {
    const museums = this.firestore.firestore.collection('niveaux').where('id', '==', id);
    museums.get().then((querySnapshot) =>  {
      querySnapshot.forEach((doc) => {
        resolve(
          {id: doc.id,
            ...doc.data()} as Niveau
          );
      });
    });
  });
}

deleteNiveau(item: Niveau) {
  this.firestore.doc('niveaux/' + item.id).delete();
}

newUpdateVersion(element: Niveau, attribut: string, value: any) {
  const batch = this.firestore.firestore.batch();
  const nextDocument1 = this.firestore.firestore.collection('niveaux').doc(element.id);
  batch.update(nextDocument1, `${attribut}`, value);
  batch.commit().then(() => {
  }).catch((error) => { console.error('Error updzting document: ', error); });
}

}
