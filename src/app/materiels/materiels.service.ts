import { Injectable } from '@angular/core';
import { Materiel } from './materiel';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Exercice } from '../exercices/exercice';

@Injectable({
  providedIn: 'root'
})
export class MaterielsService {

  materiels: Materiel[];
  materielSubject = new Subject<any[]>();
  materielsSelected: Materiel[] = [];

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
    this.firestore.collection('materiels', ref => ref.orderBy('nom'))
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

  getAllMaterielsVisible() {
    this.firestore.collection('materiels', ref =>
      ref.where('visibility', '==', true)
         .orderBy('nom'))
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


  addMaterielSelected(item: Materiel) {
    this.materielsSelected.push(item);
  }

  deleteMaterielSelected(item: Materiel) {
    const index = this.materielsSelected.findIndex(it => it.id === item.id);
    if (index >= 0) {
      this.materielsSelected.splice(index, 1);
    }
  }

  resetMaterielSelected() {
    this.materielsSelected = [];
  }


  // section de  sauvegarde et d'autres opérations des exercices
  // dans la sous collection des materiels

  writeExercice(materiel: Materiel, exercice: Exercice) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('materiels').doc(materiel.id)
                            .collection('exercices').doc(exercice.id);

    const data = Object.assign({}, exercice);
    batch.set(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

  deleteExercice(materiel: Materiel, exercice: Exercice) {
    this.firestore.doc('materiels/' + materiel.id).collection('exercices').doc(exercice.id).delete();
  }

  getExercicesInSubCollection(materiel: Materiel) {
    return new Promise<Exercice[]>((resolve, reject) => {
        const local = [];
        this.firestore.firestore.collection('materiels').doc(materiel.id).collection('exercices')
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            local.push(
              {
                id: doc.id,
                ...doc.data()
              } as Exercice);
          });
      });
        resolve(local);
    });
  }


}
