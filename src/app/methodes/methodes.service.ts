import { MethodeAvance } from './../programmes/methode-avance';
import { Niveau } from './../shared/niveaux/niveau';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Methode } from './methode';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MethodesService {

  methodes: Methode[];
  methodeSubject = new Subject<any[]>();

  methodesForProgramme: Methode[];
  methodesForProgrammeSubject = new Subject<any[]>();

  // SECTION DES PROGRAMMES => SEANCES => BLOCS

  methodes15: Methode[];
  methodes15Subject = new Subject<any[]>();

  methodes30: Methode[];
  methodes30Subject = new Subject<any[]>();

  methodes15Cardio: Methode[];
  methodes15CardioSubject = new Subject<any[]>();

  methodes30Cardio: Methode[];
  methodes30CardioSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

createMethode(methode: Methode): void {
    const batch = this.firestore.firestore.batch();

    const currentid = this.firestore.firestore.collection('methodes').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('methodes').doc(currentid);

    let data = Object.assign({}, methode);
    data = Object.assign(methode, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/methodes', currentid]);
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

getAllMethodes(): void {
    this.firestore.collection('methodes', ref => ref.orderBy('nom'))
                  .snapshotChanges().subscribe( data => {
       this.methodes = data.map( e => {
        const anotherData = e.payload.doc.data() as Methode;
        return  {
          ...anotherData
        } as Methode;
      });
       this.emitMethodeSubject();
    });
}

emitMethodeSubject() {
    this.methodeSubject.next(this.methodes.slice());
}

/*
getMethodesForProgrammeFusion(niveau: Niveau, orientation: string, duree: string): Methode[]   {
  const data: Methode[] = [];
  this.firestore.firestore.collection('methodes')
  .where('orientation', '==', orientation)
  .where('duree', '==', duree)
  .where('niveau', '==', niveau)
  .onSnapshot((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(
      {
        id : doc.id,
        ...doc.data()
      } as Methode);
  });
});
  return data;
}
 */

getSingleMethode(id: string) {
    return new Promise<Methode>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('methodes').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Methode
            );
        });
      });
    });
  }

deleteMethode(methode: Methode) {
    this.firestore.doc('methodes/' + methode.id).delete();
  }

newUpdateVersion(element: Methode, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('methodes').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }



  // SECTION DES PROGRAMMES => SEANCES => BLOCS

  getMethodesForProgramme(niveau: Niveau, orientation: string, duree: string) {
    this.firestore.collection('methodes', ref =>
    ref.where('orientation', '==', orientation)
    .where('duree', '==', duree)
    .where('niveau', '==', niveau))
                    .snapshotChanges().subscribe( data => {
         this.methodesForProgramme = data.map( e => {
          const anotherData = e.payload.doc.data() as Methode;
          return  {
            ...anotherData
          } as Methode;
        });
         this.emitMethodesForProgrammeSubject();
      });
  }
  emitMethodesForProgrammeSubject() {
    this.methodesForProgrammeSubject.next(this.methodesForProgramme.slice());
  }

  getMethodes15(niveau: Niveau, orientation: string, duree: string) {
    this.firestore.collection('methodes', ref =>
    ref.where('orientation', '==', orientation)
    .where('duree', '==', duree)
    .where('niveau', '==', niveau))
                    .snapshotChanges().subscribe( data => {
         this.methodes15 = data.map( e => {
          const anotherData = e.payload.doc.data() as Methode;
          return  {
            ...anotherData
          } as Methode;
        });
         this.emitMethodes15Subject();
      });
  }
  emitMethodes15Subject() {
    this.methodes15Subject.next(this.methodes15.slice());
  }

  getMethodes30(niveau: Niveau, orientation: string, duree: string) {
    this.firestore.collection('methodes', ref =>
    ref.where('orientation', '==', orientation)
    .where('duree', '==', duree)
    .where('niveau', '==', niveau))
                    .snapshotChanges().subscribe( data => {
         this.methodes30 = data.map( e => {
          const anotherData = e.payload.doc.data() as Methode;
          return  {
            ...anotherData
          } as Methode;
        });
         this.emitMethodes30Subject();
      });
  }
  emitMethodes30Subject() {
    this.methodes30Subject.next(this.methodes30.slice());
  }


  getMethodes15Cardio(niveau: Niveau, orientation: string, duree: string) {
    this.firestore.collection('methodes', ref =>
    ref.where('orientation', '==', orientation)
    .where('duree', '==', duree)
    .where('niveau', '==', niveau))
                    .snapshotChanges().subscribe( data => {
         this.methodes15Cardio = data.map( e => {
          const anotherData = e.payload.doc.data() as Methode;
          return  {
            ...anotherData
          } as Methode;
        });
         this.emitMethodes15CardioSubject();
      });
  }
  emitMethodes15CardioSubject() {
    this.methodes15CardioSubject.next(this.methodes15Cardio.slice());
  }

  getMethodes30Cardio(niveau: Niveau, orientation: string, duree: string) {
    this.firestore.collection('methodes', ref =>
    ref.where('orientation', '==', orientation)
    .where('duree', '==', duree)
    .where('niveau', '==', niveau))
                    .snapshotChanges().subscribe( data => {
         this.methodes30Cardio = data.map( e => {
          const anotherData = e.payload.doc.data() as Methode;
          return  {
            ...anotherData
          } as Methode;
        });
         this.emitMethodes30CardioSubject();
      });
  }
  emitMethodes30CardioSubject() {
    this.methodes30CardioSubject.next(this.methodes30Cardio.slice());
  }

}
