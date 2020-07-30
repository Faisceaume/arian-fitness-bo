import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trophee } from './trophee';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TropheesService {

  tropheesList: Trophee[];
  tropheesListSubject = new Subject<Trophee[]>();

  trophee: Trophee;
  tropheeSubject = new Subject<Trophee>();

  constructor(
    private db: AngularFirestore,
    private router: Router
    ) { }

  /* EMIT SUBJECT */
  emitTropheesListSubject() {
    this.tropheesListSubject.next( this.tropheesList );
  }
  emitTropheeSubject() {
    this.tropheeSubject.next( this.trophee );
  }

  /* CREATE */
  createNewTrophee(trophee: Trophee) {
    const batch = this.db.firestore.batch();
    const id = trophee.$id = this.db.createId();
    trophee.timestamp = new Date().getTime()
    const ref = this.db.firestore.collection('trophees').doc(id);
    batch.set(ref, trophee);
    batch.commit().then(() => {
      this.router.navigate(['trophees', id]);
    }).catch(err => console.log('Erreur lors de la creation du trophées : ', err));
  }

  /* READ */
  getAllTrophees() {
    this.db.collection('trophees', ref => ref.orderBy('timestamp')).snapshotChanges().subscribe(data => {
      this.tropheesList = data.map(element => { return element.payload.doc.data() as Trophee });
      this.emitTropheesListSubject();
    });
  }

  getOneTrophee(idTrophee: string) {
    this.db.collection('trophees').doc(idTrophee).get().subscribe(data => {
      this.trophee = data.data() as Trophee;
      this.emitTropheeSubject();
    });
  }

  /* UPDATE */
  updateTrophee() {

  }

  updateField(champ, valeurCHamp, idTrophee) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('trophees').doc(idTrophee);
    batch.update(ref, `${champ}`, valeurCHamp);
    batch.commit().then(() => {
      console.log(`${champ} a la valeur ${valeurCHamp}`)
    }).catch(err => {
      console.log('Erreur lors de la mise a jour du trophée', err);
    });
  }

  newUpdateVersion(element: Trophee, attribut: string, value: any) {
    const batch = this.db.firestore.batch();
    const nextDocument1 = this.db.firestore.collection('trophees').doc(element.$id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
    }).catch((error) => { console.error('Error updating document: ', error); });
  }

  /* DELETE */
  deleteTrophee(idTrophee: string) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('trophees').doc(idTrophee);
    batch.delete(ref);
    batch.commit().then(() => {
      console.log('Trophée supprimé avec succès');
    }).catch(err => {
      console.log('Erreur lors de la suppression du trophee ', err);
    });
  }

}
