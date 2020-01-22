import { Injectable } from '@angular/core';
import { Materiel } from './materiel';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterielsService {

  materiels: Materiel[];
  materielSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createMateriel(materiel: Materiel) {
    const batch = this.firestore.firestore.batch();

    const currentid = this.firestore.firestore.collection('materiels').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('materiels').doc(currentid);

    let data = Object.assign({}, materiel);
    data = Object.assign(materiel, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/materiels', currentid]);
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllMateriels() {
    this.firestore.collection('materiels')
                  .snapshotChanges().subscribe( data => {
       this.materiels = data.map( e => {
        const anotherData = e.payload.doc.data() as Materiel;
        return  {
          ...anotherData
        } as Materiel;
      });
       this.emitMaterielsSubject();
    });
  }

  emitMaterielsSubject() {
    this.materielSubject.next(this.materiels.slice());
  }

  getSingleMateriel(id: string) {
    return new Promise<Materiel>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('materiels').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Materiel
            );
        });
      });
    });
  }

  deleteMateriel(materiel: Materiel) {
    this.firestore.doc('materiels/' + materiel.id).delete();
  }

  newUpdateVersion(element: Materiel, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('materiels').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
