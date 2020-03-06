import { ExerciceSerie } from './exercice-serie';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ExercicesService } from '../exercices/exercices.service';
import { Exercice } from '../exercices/exercice';

@Injectable({
  providedIn: 'root'
})
export class ExercicesSeriesService {

  exercicesSeries: ExerciceSerie[];

  constructor(private firestore: AngularFirestore,
              private exercicesService: ExercicesService,
              private router: Router) { }

  createExerciceSerie(item: ExerciceSerie) {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('seriesfixes').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('seriesfixes').doc(currentid);
    let data = Object.assign({}, item);
    data = Object.assign(item, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      this.router.navigate(['/exercices-series', 'serie-details', currentid]);
            }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getSingleExerciceSerie(id: string) {
    return new Promise<ExerciceSerie>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('seriesfixes').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as ExerciceSerie
            );
        });
      });
    });
  }

  newUpdateVersion(element: ExerciceSerie, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('seriesfixes').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }

  // DENORMALISATION SERIEFIXE => EXERCICE

  addSerieFixeOnExercice(exercice: Exercice, exerciceSerie: ExerciceSerie) {
    let serieFixeId = [];
    if (exercice.seriefixeid) {
      serieFixeId = exercice.seriefixeid;
      serieFixeId.push(exerciceSerie.id);
    } else {
      serieFixeId = [exerciceSerie.id];
    }
    this.exercicesService.newUpdateVersion(exercice, 'seriefixeid', serieFixeId);

    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('seriesfixes')
                          .doc(exerciceSerie.id).collection('exercices').doc(exercice.id);
    batch.set(nextDocument1, exercice);
    batch.commit().then(() => {
     }).catch((error) => { console.error('Error creating document: ', error); });
  }

  deleteSerieFixeOnExercice(exercice: Exercice, exerciceSerie: ExerciceSerie) {
    let serieFixeId = [];
    this.exercicesService.getSingleExercice(exercice.id).then((data: Exercice) => {
      serieFixeId = data.seriefixeid;

      const id = serieFixeId.findIndex(it => it === exerciceSerie.id);
      if (id >= 0) {
      serieFixeId.splice(id, 1);
      }

      this.exercicesService.newUpdateVersion(data, 'seriefixeid', serieFixeId);

      const batch = this.firestore.firestore.batch();
      const nextDocument1 = this.firestore.firestore.collection('seriesfixes')
                          .doc(exerciceSerie.id).collection('exercices').doc(exercice.id);
      batch.delete(nextDocument1);
      batch.commit().then(() => {
     }).catch((error) => { console.error('Error creating document: ', error); });
    });
  }

}
