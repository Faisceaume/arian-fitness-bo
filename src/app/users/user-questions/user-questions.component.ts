import { Questions } from './../../questionnaires/questions';
import { QuestionnairesService } from './../../questionnaires/questionnaires.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Questionnaires } from 'src/app/questionnaires/questionnaires';

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

  constructor(public dialogRef: MatDialogRef<UserQuestionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private questionnairesService: QuestionnairesService) { }

  ngOnInit() {
    this.questionnairesService.getQuestionnaireByName(this.data.name).then(data => {
      this.questionnaire = data;
    }).then( () => {
      this.questionnairesService.getAllQuestionsActiveInOrder(this.questionnaire.id);
      this.questionnairesService.questionsListSubject.subscribe(liste => {
        this.questions = liste;
      });
    });
  }

  backQuestion() {
    if (this.indexQuestion > 0) {
      this.indexQuestion -= 1;
    }
  }

  nextQuestion() {
    if (this.indexQuestion + 1 < this.questions.length) {
      this.indexQuestion += 1;
    }
  }

  reponsesSelect(positionReponse: number) {
    if ( (this.indexQuestion + 1 ===  this.questions.length) && !this.arret) {
      this.questionsOK.push(this.questions[this.indexQuestion]);
      this.reponsesOk.push(this.questions[this.indexQuestion].reponses[positionReponse]);
      this.arret = true;
    } else if (!this.arret) {
      this.questionsOK.push(this.questions[this.indexQuestion]);
      this.reponsesOk.push(this.questions[this.indexQuestion].reponses[positionReponse]);
      this.nextQuestion();
    }
  }

}
