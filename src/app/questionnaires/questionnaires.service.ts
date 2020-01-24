import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Questionnaires } from './questionnaires';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  questionnairesList: Questionnaires[];
  questionnairesListSubject = new Subject<Questionnaires[]>();

  constructor(private db: AngularFirestore) { }

  /*********************************************/
  /*********************************************/
  /************** EMIT SUBJECT ******************/
  /*********************************************/
  /*********************************************/
  emitQuestionnairesListSubject() {
    this.questionnairesListSubject.next( this.questionnairesList );
  }



  /*********************************************/
  /*********************************************/
  /******************* CREATE ******************/
  /*********************************************/
  /*********************************************/
  createQuestionnaire(nameArg: string, timestampArg: Date) {
    const batch = this.db.firestore.batch();
    const idDoc = this.db.createId();
    const data = {
      id: idDoc,
      name: nameArg,
      timestamp: timestampArg
    } as Questionnaires;
    const ref = this.db.firestore.collection('questionnaires').doc( idDoc );
    batch.set(ref, data);
    batch.commit().then(() => console.log('Questionnaire ajouté avec succès') );
  }

  createQuestion(idQuestionnaire: string) {
    const batch = this.db.firestore.batch();
    const idDoc = this.db.createId();

    const data1 = {};
    const data2 = {};

    const ref1 = this.db.firestore.collection('questionnaires').doc( idQuestionnaire ).collection('questions').doc( idDoc );
    const ref2 = this.db.firestore.collection('questions').doc( idDoc );

    batch.set(ref1, data1);
    batch.set(ref2, data2);

    batch.commit().then(() => console.log('Questions crées avec succès'));
  }


  /*********************************************/
  /*********************************************/
  /******************* GET *********************/
  /*********************************************/
  /*********************************************/
  getAllQuestionnaires() {
    this.db.collection('questionnaires').snapshotChanges().subscribe(array => {
      this.questionnairesList = array.map( e => {
        return e.payload.doc.data() as Questionnaires;
      });
      this.emitQuestionnairesListSubject();
    });
  }


  /*********************************************/
  /*********************************************/
  /**************** UPDATE *********************/
  /*********************************************/
  /*********************************************/
  updateQuestionnaire( id: string, nameArg: string, timestampArg: Date) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('questionnaires').doc( id );
    batch.update(ref, {name: nameArg, timestamp: timestampArg});
    batch.commit().then( () => console.log('édition réussie') );
  }


  /*********************************************/
  /*********************************************/
  /******************* DELETE ******************/
  /*********************************************/
  /*********************************************/
  deleteQuestionnaire( id ) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('questionnaires').doc( id );
    batch.delete(ref);
    batch.commit().then(() => console.log('Suppression réussi !!!'));
  }
}
