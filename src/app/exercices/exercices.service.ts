import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Exercice } from './exercice';
import { Subject, BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../shared/categories/categories.service';
import { Niveau } from '../shared/niveaux/niveau';
import { MaterielsService } from '../materiels/materiels.service';


@Injectable({
  providedIn: 'root'
})
export class ExercicesService {

  exercices: Exercice[];
  exerciceSubject = new Subject<any[]>();

  photoThumbnail: string;
  photoThumbnailSubject = new BehaviorSubject<any>('');

  oneSerieExerciceFixe: any;
  oneSerieExerciceFixeSubject = new Subject<any>();

  oneSerieFixeFromExercice: any;
  oneSerieFixeFromExerciceSubject = new Subject<any>();

  constructor(private firestore: AngularFirestore,
              private router: Router,
              private categoriesService: CategoriesService,
              private materielsService: MaterielsService) { }


  createExercice(exercice: Exercice) {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('exercices').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('exercices').doc(currentid);
    let data = Object.assign({}, exercice);
    data = Object.assign(exercice, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      exercice.categories.forEach(element => {
        this.firestore.collection('exe_cat').doc(element.id).collection('exercices').doc(currentid)
        .set(exercice);
        const listeExeid = element.exeids;
        listeExeid.push(currentid);
        this.categoriesService.newUpdateVersion(element, 'exeids', listeExeid, 'exe_cat');
      });
    }).then(() => {
          console.log('Batch Commited');
          this.router.navigate(['/exercices', currentid]);
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllExercices() {
    this.firestore.collection('exercices', ref => ref.orderBy('numero'))
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

  // getExercicesForUser(userid):void {

  // }

  emitExercicesSubject() {
    this.exerciceSubject.next(this.exercices.slice());
  }

  emitSingleExerciceSubject() {
    this.photoThumbnailSubject.next(this.photoThumbnail);
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

  getSingleExerciceThumbnails(id: string) {
    //const doc = fb.firestore().collection('exercices').doc(id).onSnapshot()
    const ref =  this.firestore.collection('exercices').doc(id).snapshotChanges().subscribe((doc:any) => {
      this.photoThumbnail = doc.payload.data().photoThumbnail;
      this.emitSingleExerciceSubject();
    });
  }

  getSingleExerciceByUrl(url: string) {
    return new Promise<Exercice>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('exercices').where('video', '==', url);
      museums.get().then((querySnapshot) =>  {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.forEach((doc) => {
            resolve(
              {id: doc.id,
                ...doc.data()} as Exercice
              );
          });
        } else {
          reject()
        }

      });
    });
  }

  deleteExercice(exercice: Exercice) {
    exercice.materiels.forEach(mat => {
      this.materielsService.deleteExercice(mat, exercice);
    });
    this.firestore.doc('exercices/' + exercice.id).delete();
  }

  newUpdateVersion(element: Exercice, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('exercices').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
      this.updateSubCollectionExerciceOnSerieFixe(element);
    }).catch((error) => { console.error('Error updating document: ', error); });
  }

  updateSubCollectionExerciceOnSerieFixe(exercice: Exercice) {

    this.getSingleExercice(exercice.id).then((currentExercice: Exercice) => {
      if (currentExercice.seriefixeid) {
        currentExercice.seriefixeid.forEach(element => {
          const nextDocument1 = this.firestore.firestore.collection('seriesfixes')
                            .doc(element).collection('exercices').doc(currentExercice.id);
          const batch = this.firestore.firestore.batch();
          batch.update(nextDocument1, currentExercice);
          batch.commit().then(() => {
          }).catch((error) => { console.error('Error updzting document: ', error); });
        });
      }
    });
  }


  /////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////// CREATE ////////////////////
  ///////////////////////////////////////////

  emitOneSerieExerciceFixe() {
    this.oneSerieExerciceFixeSubject.next( this.oneSerieExerciceFixe );
  }
  emitOneSerieFixeFromExerciceSubject() {
    this.oneSerieFixeFromExerciceSubject.next( this.oneSerieFixeFromExercice );
  }

  createSerieExercice(dataArg, dataArg2: Exercice[], dataArg3: any[]) {
    const batch = this.firestore.firestore.batch();
    const idRef = this.firestore.createId();
    let data = Object.assign({}, dataArg);
    data = Object.assign(dataArg, {id: idRef, timestamp: new Date().getTime(), detailExos: dataArg3});
    const ref = this.firestore.firestore.collection('seriesfixes').doc( idRef );
    batch.set(ref, {
      id: idRef,
      nom: data.nom,
      consigne: data.consigne,
      senior: data.senior,
      type: data.type,
      pathology: data.pathology,
      timestamp: data.timestamp,
      detailExos: data.detailExos
    });
    batch.commit().then(() => {
      const batch2 = this.firestore.firestore.batch();
      for (let i = 0; i < dataArg2.length; i++) {
        dataArg2[i] = Object.assign(dataArg2[i], {detailExo: dataArg3[i], n: 'exo'});
      }
      dataArg2.forEach(element => {
        const data2 = Object.assign(element, {idSerieFixe: idRef});
        const ref2 = this.firestore.firestore
                         .collection('seriesfixes')
                         .doc(idRef)
                         .collection('exercice')
                         .doc(element.id);
        batch2.set(ref2, data2);
      });
      const ref3 = this.firestore.firestore.collection('exercices').doc( idRef );
      batch2.set(ref3, {
        id: idRef,
        exercices: dataArg2
      });
      batch2.commit().then(() => console.log('Sous collection mis à jour'));
      console.log('Serie exercice crée!!!');
    });
  }


  /////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////// READ //////////////////////
  ///////////////////////////////////////////


  getOneSerieExercice(id) {
    this.firestore.collection('seriesfixes').doc(id).get().subscribe(data => {
      this.oneSerieExerciceFixe = data.data();
      this.emitOneSerieExerciceFixe();
    });
  }

  getSerieExerciceFromExercice(id) {
    this.firestore.collection('exercices').doc(id).get().subscribe(data => {
      this.oneSerieFixeFromExercice = data.data();
      this.emitOneSerieFixeFromExerciceSubject();
    });
  }



  /////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////// UPDATE //////////////////////
  ///////////////////////////////////////////
  updateSerieExerciceFixe(idArg, dataArg1, dataArg2: Exercice[], dataArg3: any[]) {
    const batch = this.firestore.firestore.batch();
    const ref = this.firestore.firestore.collection('seriesfixes').doc( idArg );
    const data = Object.assign(dataArg1, {id: idArg, timestamp: new Date().getTime(), detailExos: dataArg3});
    batch.update(ref, {
      nom: data.nom,
      consigne: data.consigne,
      senior: data.senior,
      pathology: data.pathology,
      type: data.type,
      timestamp: data.timestamp,
      detailExos: data.detailExos
    });

    batch.commit().then(() => {
      const batch2 = this.firestore.firestore.batch();
      for (let i = 0; i < dataArg2.length; i++) {
        dataArg2[i] = Object.assign(dataArg2[i], {idRef: idArg, detailExo: dataArg3[i], n: 'exo'});
      }
      const query = this.firestore.firestore
                    .collection('seriesfixes').doc( idArg )
                    .collection('exercice').where('n', '==', 'exo');
      const prom = new Promise((resolve, reject) => {
        query.get().then((querySnaphot) => {
          querySnaphot.forEach(doc => {
            doc.ref.delete();
            resolve('');
          });
        });
      });
      prom.then(() => {
        dataArg2.forEach(element => {
          const ref2 = this.firestore.firestore
                           .collection('seriesfixes')
                           .doc(idArg)
                           .collection('exercice')
                           .doc(element.id);
          batch2.set(ref2, element);
        });
        console.log( dataArg2 );
        const ref3 = this.firestore.firestore.collection('exercices').doc( idArg );
        batch2.update(ref3, {
          exercices: dataArg2
        });
        console.log('Update serie fixe success');
        batch2.commit().then(() => console.log('Update finish'));
      });
    });
  }

  /////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////// DELETE //////////////////////
  ///////////////////////////////////////////
  deleteSerieExerciceFixe(id) {
    const query = this.firestore.firestore
                      .collection('seriesfixes').doc( id )
                      .collection('exercice').where('idSerieFixe', '==', id);
    const promesse = new Promise((resolve, reject) => {
      query.get().then((querySnaphot) => {
        querySnaphot.forEach(doc => {
          doc.ref.delete();
          resolve('');
        });
      });
    });

    promesse.then(() => {
      const batch = this.firestore.firestore.batch();
      const ref = this.firestore.firestore.collection('seriesfixes').doc(id);
      const ref2 = this.firestore.firestore.collection('exercices').doc(id);
      batch.delete(ref2);
      batch.delete(ref);
      batch.commit().then(() => console.log('Suppression de la serie d\'exercice fixe réussi '));
    });
  }



  /////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////// METHODES FOR SIMULATION ///
  ///////////////////////////////////////////

  getExercicesForUser(genre: string, age: string, niveau: Niveau, position: string) {
    let url: any;

    if (position !== 'toutes') {
     url = this.firestore.collection('exercices', ref =>
    ref.where('genre', '==', genre)
    .where('age', '==', age)
    .where('niveau', '==', niveau)
    .where('position', '==', position));
    } else {
     url = this.firestore.collection('exercices', ref =>
    ref.where('genre', '==', genre)
    .where('age', '==', age)
    .where('niveau', '==', niveau));
    }
    return new Promise<Exercice[]>((resolve, reject) => {
      url.snapshotChanges().subscribe(res => {
        const exercices = res.map( e => {
        const anotherData = e.payload.doc.data() as Exercice;
        return  {
          ...anotherData
        } as Exercice;
        });
        resolve(exercices);
      });
    });
  }

}
