import { Prognut } from './prognut';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Aliment } from './aliment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  aliments: Aliment[];
  alimentsSubject = new Subject<any[]>();

  prognuts: Prognut[];
  prognutsSubject = new Subject<any[]>();

  foodsData: any;

  constructor(private firestore: AngularFirestore,
              private router: Router,
              private http: HttpClient) { }


  // SECTION DES METHODES D'EDIDITION DES ALIMENTS

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

  getAlimentForApi(libelle: string): void {
    this.foodsData = null;
    this.http
    .get<any>('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + libelle + '&search_simple=1&action=process&json=1')
    .forEach(data => {
       this.foodsData = data;
      // image_url  image_front_url
     //  data.products.forEach(element => {
     //   console.log(element);
     // });
    });
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



  // SECTION DES METHODES D'EDIDITION DES PROGRAMMES DE NUTRITION

  createProgNut(prognut: Prognut) {
    const batch = this.firestore.firestore.batch();
    const currentid = this.firestore.firestore.collection('prognuts').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('prognuts').doc(currentid);
    let data = Object.assign({}, prognut);
    data = Object.assign(prognut, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);
    batch.commit().then(() => {
      this.router.navigate(['/aliments/prognuts', currentid]);
            }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllProgNuts() {
    this.firestore.collection('prognuts', ref => ref.orderBy('nom'))
                .snapshotChanges().subscribe( data => {
    this.prognuts = data.map( e => {
      const anotherData = e.payload.doc.data() as Prognut;
      return  {
        ...anotherData
      } as Prognut;
    });
    this.emitProgNutSubject();
  });
  }

  emitProgNutSubject() {
    this.prognutsSubject.next(this.prognuts.slice());
  }

  getSingleProgNut(id: string) {
    return new Promise<Prognut>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('prognuts').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Prognut
            );
        });
      });
    });
  }

  deleteProgNut(id: string) {
    this.firestore.doc('prognuts/' + id).delete();
  }

  updateProgNut(element: Prognut, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('prognuts').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }
}
