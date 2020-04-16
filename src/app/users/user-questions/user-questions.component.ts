import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { Materiel } from './../../materiels/materiel';
import { Questions } from './../../questionnaires/questions';
import { QuestionnairesService } from './../../questionnaires/questionnaires.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Questionnaires } from 'src/app/questionnaires/questionnaires';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { MaterielAvance } from '../materiel-avance';
import { Pathologie } from 'src/app/shared/pathologies/pathologie';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.css']
})
export class UserQuestionsComponent implements OnInit {

  questionnaireNumber: string;
  questionnaire: Questionnaires;
  questions: Questions[];

  indexQuestion = 0;
  questionsOK = [];
  reponsesOk  = [];
  arret: boolean;

  materiels: Materiel[];
  materielsSelected: MaterielAvance[] = [];
  toAddMateriels: boolean;

  showSaveButton: boolean;

  pathologies: Pathologie[];
  pathologieSelected: Pathologie;
  toAddPathologie: boolean;

  pointfaibles: PathologieAvance[];
  pointfaiblesSelected: PathologieAvance[] = [];
  toAddPointfaibles: boolean;

  constructor(public dialogRef: MatDialogRef<UserQuestionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private questionnairesService: QuestionnairesService,
              private materielsServices: MaterielsService,
              private pathologiesService: PathologiesService) { }

  ngOnInit() {
    this.questionnaireNumber = this.data.name[0];

    if (this.questionnaireNumber === '1' || this.questionnaireNumber === '3') {
      this.materielsServices.getAllMaterielsVisible();
      this.materielsServices.materielSubject.subscribe(data => {
        this.materiels = data;
      });
    } else if (this.questionnaireNumber === '2') {
      this.pathologiesService.getAllPathologies();
      this.pathologiesService.pathologieSubject.subscribe(data => {
        this.pathologies = data;
      });

      this.pathologiesService.getAllPointFaibles();
      this.pathologiesService.pointfaibleSubject.subscribe(data => {
        this.pointfaibles = data;
      });
    }

    this.questionnairesService.getQuestionnaireByName(this.data.name).then(data => {
      this.questionnaire = data;
    }).then( () => {
      this.questionnairesService.getAllQuestionsActiveInOrder(this.questionnaire.id);
      this.questionnairesService.questionsListSubject.subscribe(liste => {
        this.questions = liste;
        this.questions.forEach((qs, i) => {
          this.questionsOK[i] = qs;
          this.reponsesOk[i] = 'non fourni';
        });
      });
    });
  }


  /*********************************************/
      // shared methodes for all questionnaires
  /*********************************************/
  nextQuestion() {
    if (this.questionnaireNumber === '1') {
      this.q1NextQuestion();
    } else if (this.questionnaireNumber === '2') {
      this.q2NextQuestion();
    } else if (this.questionnaireNumber === '3') {
      this.q3NextQuestion();
    }
  }

  backQuestion() {
    if (this.questionnaireNumber === '1') {
      this.q1BackQuestion();
    } else if (this.questionnaireNumber === '2') {
      this.q2BackQuestion();
    } else if (this.questionnaireNumber === '3') {
      this.q3BackQuestion();
    }
  }

  selectedAnswer(positionReponse: number) {
    this.reponsesOk[this.indexQuestion] = this.questionsOK[this.indexQuestion].reponses[positionReponse];
    if (this.indexQuestion + 1 === this.questionsOK.length) {
      this.showSaveButton = true;
    } else {
      this.nextQuestion();
    }
  }

  selectMateriel(item: Materiel) {
    const id = this.materielsSelected.findIndex(it => it.id === item.id);
    if (id < 0) {
      this.materielsSelected.push(item);
    }
    this.reponsesOk[this.indexQuestion] = this.materielsSelected;
  }

  setResult() {
    return {
      questions: this.questionsOK,
      reponses: this.reponsesOk};
  }

/*********************************************/
      // questionnaire 1 methodes
/*********************************************/

q1NextQuestion() {
  if (this.indexQuestion === 1 && this.reponsesOk[1] !== 'Non' && this.reponsesOk[1].trim() !== 'non fourni') {
    this.indexQuestion += 2;
    this.toAddMateriels = this.indexQuestion === 3 ? true : false;
  } else if (this.indexQuestion === 3 && this.reponsesOk[1] !== 'Non' && this.reponsesOk[1].trim() !== 'non fourni') {
    this.showSaveButton = true;
  } else if (this.indexQuestion === 4 && !(this.reponsesOk[4].trim() === 'Préparation physique orientée')) {
    this.showSaveButton = true;
  } else if (this.indexQuestion + 1 < this.questions.length) {
    this.indexQuestion += 1;
  }
  this.toAddMateriels = this.indexQuestion === 3 ? true : false;
}

q1BackQuestion() {
  this.showSaveButton = false;
  if (this.indexQuestion > 0) {
      this.indexQuestion -= 1;
    }
}

/*********************************************/
      // questionnaire 2 methodes
/*********************************************/

q2NextQuestion() {
  if (this.indexQuestion === 0 && this.reponsesOk[0].trim() === 'RAS') {
    if (this.data.niveaunombre === 1) {
      this.indexQuestion += 2;
    } else {
      this.indexQuestion += 3;
    }
  } else if (this.indexQuestion === 1) {
    if (this.data.niveaunombre === 1) {
      this.indexQuestion += 1;
    } else {
      this.indexQuestion += 2;
    }
  } else if (this.indexQuestion === 2) {
    this.showSaveButton = true;
  } else if (this.indexQuestion === 3) {
    const local = this.reponsesOk[3];
    // tslint:disable-next-line: radix
    if (parseInt(local[0]) > 2) {
      if (this.data.asSDS) {
        this.indexQuestion += 1;
      } else {
        this.showSaveButton = true;
      }
    } else {
      this.showSaveButton = true;
    }
  } else if (this.indexQuestion === 4) {
    const local = this.reponsesOk[4];
    if (local === 'Oui') {
      this.indexQuestion += 1;
    } else {
      this.showSaveButton = true;
    }
  } else if (this.indexQuestion + 1 < this.questions.length) {
    this.indexQuestion += 1;
  }
  this.toAddPathologie = this.indexQuestion === 1 ? true : false;
  this.toAddPointfaibles = this.indexQuestion === 5 ? true : false;
}

q2BackQuestion() {
  this.showSaveButton = false;
  if (this.toAddPathologie) {
    this.toAddPathologie = false;
  }
  if (this.toAddPointfaibles) {
    this.toAddPointfaibles = false;
  }
  if (this.indexQuestion > 0) {
      this.indexQuestion -= 1;
    }
}

selectPathologie(item: Pathologie) {
  this.pathologieSelected = item;
  const local = new PathologieAvance();
  local.acronyme = item.acronyme;
  local.id = item.id;
  local.nom = item.nom;
  this.reponsesOk[this.indexQuestion] = Object.assign({}, local);
  this.q2NextQuestion();
}

selectPointFaible(item: Pathologie) {

  const id = this.pointfaiblesSelected.findIndex(it => it.id === item.id);

  if (id < 0) {
    const local = new PathologieAvance();
    local.acronyme = item.acronyme;
    local.id = item.id;
    local.nom = item.nom;
    this.pointfaiblesSelected.push(Object.assign({}, local));
  }

  this.reponsesOk[this.indexQuestion] = this.pointfaiblesSelected;
}

/*********************************************/
      // questionnaire 3 methodes
/*********************************************/

q3NextQuestion() {
if (this.indexQuestion + 1 < this.questions.length) {
    this.indexQuestion += 1;
  } else if (this.indexQuestion + 1 === this.questions.length) {
    this.showSaveButton = true;
  }
this.toAddMateriels = this.indexQuestion === 2 ? true : false;
}

q3BackQuestion() {
  this.showSaveButton = false;
  if (this.toAddPathologie) {
    this.toAddPathologie = false;
  }
  if (this.indexQuestion > 0) {
      this.indexQuestion -= 1;
    }
}

}
