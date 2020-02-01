import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Questionnaires } from './questionnaires';
import { Subject } from 'rxjs';
import { Questions } from './questions';


@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  questionnairesList: Questionnaires[];
  questionnairesListSubject = new Subject<Questionnaires[]>();

  questionsList: Questions[];
  questionsListSubject = new Subject<Questions[]>();

  singleQuestion: Questions;
  singleQuestionSubject = new Subject<Questions>();

  constructor(private db: AngularFirestore) { }




  
  /*********************************************/
  /*********************************************/
  /************** EMIT SUBJECT ******************/
  /*********************************************/
  /*********************************************/
  emitQuestionnairesListSubject() {
    this.questionnairesListSubject.next( this.questionnairesList );
  }

  emitQuestionsListSubject() {
    this.questionsListSubject.next( this.questionsList );
  }

  emitSingleQuestionSubject() {
    this.singleQuestionSubject.next( this.singleQuestion );
  }






  /*********************************************/
  /*********************************************/
  /******************* CREATE ******************/
  /*********************************************/
  /*********************************************/
  createQuestionnaire(nameArg: string, timestampArg: number) {
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

  createQuestion(
    idQuestionnaire: string, dataArg: any, timestampArg: number) {
    const batch = this.db.firestore.batch();
    const idDoc = this.db.createId();

    const data: Questions = {
      id: idDoc,
      question: dataArg.question,
      reponses: dataArg.reponses,
      ordre: dataArg.ordre,
      active: dataArg.active,
      idOfQuestionnaire: idQuestionnaire,
      timestamp: timestampArg
    };

    const ref1 = this.db.firestore.collection('questionnaires').doc( idQuestionnaire ).collection('questions').doc( idDoc );
    const ref2 = this.db.firestore.collection('questions').doc( idDoc );

    batch.set(ref1, data);
    batch.set(ref2, data);

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

  getAllQuestions(idQuestionnaires: string) {
    this.db.collection('questionnaires').doc(idQuestionnaires).collection('questions').snapshotChanges().subscribe(array => {
      this.questionsList = array.map(e => {
        return {...e.payload.doc.data()} as Questions;
      });
      this.emitQuestionsListSubject();
    });
  }

  getSingleQuestion(idQuestion) {
    this.db.collection('questions').doc(idQuestion).get().subscribe(d => {
      this.singleQuestion = {
        id: d.data().id,
        question: d.data().question,
        reponses: d.data().reponses,
        ordre: d.data().ordre,
        active: d.data().active,
        idOfQuestionnaire: d.data().idOfQuestionnaire,
        timestamp: d.data().timestamp
      } as Questions;
      this.emitSingleQuestionSubject();
    });
  }






  /*********************************************/
  /*********************************************/
  /**************** UPDATE *********************/
  /*********************************************/
  /*********************************************/
  updateQuestionnaire( id: string, nameArg: string, timestampArg: number) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('questionnaires').doc( id );
    batch.update(ref, {name: nameArg, timestamp: timestampArg});
    batch.commit().then( () => console.log('édition réussie') );
  }

  updateQuestion(dataArg: Questions) {
    const batch = this.db.firestore.batch();
    const ref1 = this.db.firestore
                        .collection('questionnaires')
                        .doc(dataArg.idOfQuestionnaire)
                        .collection('questions')
                        .doc(dataArg.id);
    const ref2 = this.db.firestore.collection('questions').doc(dataArg.id);
    batch.update(ref1, dataArg);
    batch.update(ref2, dataArg);
    batch.commit().then(() => console.log('Update question success'));
  }

  updateActiveField(idOfQuestionnaire, idQuestion, activeArg) {
    const batch = this.db.firestore.batch();
    const ref1 = this.db.firestore
                        .collection('questionnaires')
                        .doc(idOfQuestionnaire)
                        .collection('questions')
                        .doc(idQuestion);
    const ref2 = this.db.firestore.collection('questions').doc(idQuestion);

    batch.update(ref1, {active: activeArg});
    batch.update(ref2, {active: activeArg});
    batch.commit().then(() => console.log('Update field active success'));
  }


  updateOrdreField(idOfQuestionnaire, idQuestion, ordreArg) {
    const batch = this.db.firestore.batch();
    const ref1 = this.db.firestore
                        .collection('questionnaires')
                        .doc(idOfQuestionnaire)
                        .collection('questions')
                        .doc(idQuestion);
    const ref2 = this.db.firestore.collection('questions').doc(idQuestion);
    batch.update(ref1, {ordre: ordreArg});
    batch.update(ref2, {ordre: ordreArg});
    batch.commit().then(() => console.log('Update field ordre success'));

  }





  /*********************************************/
  /*********************************************/
  /******************* DELETE ******************/
  /*********************************************/
  /*********************************************/
  deleteQuestionnaire( id ) {
    const batch = this.db.firestore.batch();
    const query = this.db.firestore.collection('questions').where('idOfQuestionnaire', '==', id);
    query.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
    });
    const ref = this.db.firestore.collection('questionnaires').doc( id );
    batch.delete(ref);
    batch.commit().then(() => console.log('Suppression réussi !!!'));
}

  deleteQuestion(idQuestionnaire, idQuestion) {
    const batch = this.db.firestore.batch();
    const ref1 = this.db.firestore
                        .collection('questionnaires')
                        .doc( idQuestionnaire)
                        .collection('questions')
                        .doc( idQuestion );
    const ref2 = this.db.firestore.collection('questions').doc( idQuestion );

    batch.delete(ref1);
    batch.delete(ref2);

    batch.commit().then(() => console.log('Suppression de la question ok'));
  }
}
