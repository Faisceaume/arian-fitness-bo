import { Objectif } from 'src/app/shared/objectifs/objectif';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Programme } from './programme';
import { Subject } from 'rxjs';
import { User } from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class ProgrammesService {

  programmes: Programme[];
  programmeSubject  = new Subject<any>();


  // section USERS => PROGRAMME
  prognivs: Programme[];
  prognivsSubject = new Subject<any[]>();

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  createProgramme(programme: Programme) {
    const batch = this.firestore.firestore.batch();

    const currentid = this.firestore.firestore.collection('programmes').doc().id;
    const nextDocument1 = this.firestore.firestore.collection('programmes').doc(currentid);

    let data = Object.assign({}, programme);
    data = Object.assign(programme, {id: currentid, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);

    batch.commit().then(() => {
      console.log('Batch Commited');
      this.router.navigate(['/programmes', currentid]);
    }).catch((error) => { console.error('Error creating document: ', error); });
  }

  getAllProgrammes() {
    this.firestore.collection('programmes')
                  .snapshotChanges().subscribe( data => {
       this.programmes = data.map( e => {
        const anotherData = e.payload.doc.data() as Programme;
        return  {
          ...anotherData
        } as Programme;
      });
       this.emitProgrammeSubject();
    });
  }

  emitProgrammeSubject() {
    this.programmeSubject.next(this.programmes.slice());
  }

  getSingleProgramme(id: string) {
    return new Promise<Programme>((resolve, reject) => {
      const museums = this.firestore.firestore.collection('programmes').where('id', '==', id);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {id: doc.id,
              ...doc.data()} as Programme
            );
        });
      });
    });
  }

  deleteProgramme(programme: Programme) {
    this.firestore.doc('programmes/' + programme.id).delete();
  }

  newUpdateVersion(element: Programme, attribut: string, value: any) {
    const batch = this.firestore.firestore.batch();
    const nextDocument1 = this.firestore.firestore.collection('programmes').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updzting document: ', error); });
  }


  // SECTION USERS => PROGRAMME

  getProgrammeByNiveauAndFrequenceAndObjectifs(user: User) {
    this.firestore.collection('programmes', ref =>
    ref.where('niveau', '==', user.niveau)
    .where('frequence', '==', user.frequence))
                  .snapshotChanges().subscribe( data => {
       this.prognivs = data.map( e => {
        const anotherData = e.payload.doc.data() as Programme;
        return  {
          ...anotherData
        } as Programme;
      });
       this.emitProgNivSubject(user);
    });
  }

  emitProgNivSubject(user: User) {
    const local = [];
    this.prognivs.forEach(data => {
      const id = data.objectifs.findIndex(it => it.id === user.objectif.id);
      const id2 = data.semaineduniveau.findIndex(sm => sm === user.positionparcoursniveau);
      if (id >= 0 && id2 >= 0) {
        local.push(data);
      }
    });
    this.prognivsSubject.next(local.slice());
  }
}
