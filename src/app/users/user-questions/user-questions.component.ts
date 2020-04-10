import { Materiel } from './../../materiels/materiel';
import { Questions } from './../../questionnaires/questions';
import { QuestionnairesService } from './../../questionnaires/questionnaires.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Questionnaires } from 'src/app/questionnaires/questionnaires';
import { MaterielsService } from 'src/app/materiels/materiels.service';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.css']
})
export class UserQuestionsComponent implements OnInit {

  questionnaire: Questionnaires;
  questions: Questions[];

  indexQuestion = 0;
  questionsOK = [];
  reponsesOk  = [];
  arret: boolean;

  materiels: Materiel[];
  materielsSelected: Materiel[] = [];
  toAddMateriels: boolean;

  constructor(public dialogRef: MatDialogRef<UserQuestionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private questionnairesService: QuestionnairesService,
              private materielsServices: MaterielsService) { }

  ngOnInit() {

    this.materielsServices.getAllMaterielsVisible();
    this.materielsServices.materielSubject.subscribe(data => {
      this.materiels = data;
    });

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

  backQuestion() {
    if (this.indexQuestion > 0) {
      this.indexQuestion -= 1;
    }
  }

  nextQuestion() {

    if (this.indexQuestion === 1 && this.reponsesOk[1] !== 'Non') {
      this.indexQuestion += 2;
    } else if (this.indexQuestion === 3 && this.reponsesOk[1] !== 'Non') {
      this.indexQuestion += 2;
    } else if (this.indexQuestion + 1 < this.questions.length) {
      this.indexQuestion += 1;
    }
  }

  selectedAnswer(positionReponse: number) {
    this.reponsesOk[this.indexQuestion] = this.questionsOK[this.indexQuestion].reponses[positionReponse];
    this.nextQuestion();
  }


  selectMateriel(item: Materiel) {
    const id = this.materielsSelected.findIndex(it => it.id === item.id);
    if (id < 0) {
      this.materielsSelected.push(item);
    }
    this.reponsesOk[this.indexQuestion] = this.materielsSelected;
  }

}
