import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Exercice } from './exercice';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercicesService {

  exercices: Exercice[];
  exerciceSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }


  createExercice(exercice: Exercice) {
      const batch = this.firestore.firestore.batch();

      const currentid = this.firestore.firestore.collection('exercices').doc().id;
      const nextDocument1 = this.firestore.firestore.collection('exercices').doc(currentid);

      let data = Object.assign({}, exercice);
      data = Object.assign(exercice, {id: currentid, timestamp: new Date().getTime()});
      batch.set(nextDocument1, data);

      batch.commit().then(() => {
                  console.log('Batch Commited');
                  this.router.navigate(['exercices']);
                }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllExercices() {
    this.firestore.collection('exercices')
                  .snapshotChanges().subscribe( data => {
       this.exercices = data.map( e => {
        const anotherData = e.payload.doc.data() as Exercice;
        return  {
          ...anotherData
        } as Exercice;
      });
       this.emitExercicesSubject();
    });
  }

  emitExercicesSubject() {
    this.exerciceSubject.next(this.exercices.slice());
  }

  getSingleExercice(id: string) {
    return new Promise<Exercice>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('exercices').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Exercice
            );
        });
      });
    });
  }

  deleteExercice(exercice: Exercice) {
    this.firestore.doc('exercices/' + exercice.id).delete();
  }

  updateExercice(exercice: Exercice) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('exercices').doc(exercice.id);

    const data = Object.assign({}, exercice);
    batch.update(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['exercices']);
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
