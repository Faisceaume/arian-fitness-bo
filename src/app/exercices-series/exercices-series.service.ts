import { ExerciceSerie } from './exercice-serie';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ExercicesService } from '../exercices/exercices.service';
import { Exercice } from '../exercices/exercice';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercicesSeriesService {

  serieExerciceFixe: ExerciceSerie[];
  serieExerciceFixeSubject = new Subject<any[]>();

  serieExerciceFixeByType: ExerciceSerie[];
  serieExerciceFixeByTypeSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private exercicesService: ExercicesService,
              private router: Router) { }

    getAllSerieExercice() {
      this.firestore.collection('seriesfixes')
                  .snapshotChanges().subscribe( data => {
       this.serieExerciceFixe = data.map( e => {
        const anotherData = e.payload.doc.data() as ExerciceSerie;
        return  {
          ...anotherData
        } as ExerciceSerie;
        });
       this.emitSerieExercieFixe();
      });
    }
  emitSerieExercieFixe() {
    this.serieExerciceFixeSubject.next( this.serieExerciceFixe );
  }


  getAllSeriesExercicesByType(type: string) {
    this.firestore.collection('seriesfixes', ref => ref.where('type', '==', type))
                  .snapshotChanges().subscribe( data => {
       this.serieExerciceFixeByType = data.map( e => {
        const anotherData = e.payload.doc.data() as ExerciceSerie;
        return  {
          ...anotherData
        } as ExerciceSerie;
        });
       this.emitSerieExerciceByTypeSubject();
      });
  }

  emitSerieExerciceByTypeSubject() {
    this.serieExerciceFixeByTypeSubject.next(this.serieExerciceFixeByType.slice());
  }


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

  deleteExerciceSerie(element: ExerciceSerie) {

    element.exercices.forEach(current => {
      // on supprime la sous-collection
      this.firestore.firestore.collection('seriesfixes').doc(element.id).collection('exercices')
        .doc(current.exercice).delete();

      // on supprime la serie fixe dans le noeud racine de exercice
      this.exercicesService.getSingleExercice(current.exercice).then((exe: Exercice) => {
        const seriefixeid = exe.seriefixeid;
        const index = seriefixeid.findIndex(it => it === element.id);
        if (index >= 0) {
          seriefixeid.splice(index, 1);
          this.exercicesService.newUpdateVersion(exe, 'seriefixeid', seriefixeid);
        }
        });

    });
    this.firestore.doc('seriesfixes/' + element.id).delete();
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

  deleteSerieFixeOnExercice(exercice: string, exerciceSerie: ExerciceSerie) {
    let serieFixeId = [];
    this.exercicesService.getSingleExercice(exercice).then((data: Exercice) => {
      serieFixeId = data.seriefixeid;

      const id = serieFixeId.findIndex(it => it === exerciceSerie.id);
      if (id >= 0) {
      serieFixeId.splice(id, 1);
      }

      this.exercicesService.newUpdateVersion(data, 'seriefixeid', serieFixeId);

      const batch = this.firestore.firestore.batch();
      const nextDocument1 = this.firestore.firestore.collection('seriesfixes')
                          .doc(exerciceSerie.id).collection('exercices').doc(exercice);
      batch.delete(nextDocument1);
      batch.commit().then(() => {
     }).catch((error) => { console.error('Error creating document: ', error); });
    });
  }


  // section simulation User => programmes => seances

  getSerieFixeByTypeAndSenior(senior: string, type: string) {
    return new Promise<ExerciceSerie>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('seriesfixes')
      .where('senior', '==', senior)
      .where('type', '==', type);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve({id: doc.id ,...doc.data()} as ExerciceSerie);
        });
      });
    });
  }

  getExerciceById(idExo) {
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection('exercices').doc(idExo).get().subscribe(data => {
        resolve( data.data().categories );
      });
    })
  }
}
