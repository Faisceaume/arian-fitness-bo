import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../questionnaires.service';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { QuestionnairesFormComponent } from './questionnaires-form/questionnaires-form.component';
import { Questionnaires } from '../questionnaires';
import { QuestionnairesDetailComponent } from './questionnaires-detail/questionnaires-detail.component';
import { Router } from '@angular/router';
import { Questions } from '../questions';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questionnairesList: Questionnaires[];
  questionsList: Questions[];

  displayedColumns: string[] = ['ordre', 'question', 'reponses', 'timestamp', 'active', 'action'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private questionnairesService: QuestionnairesService,
    private dialog: MatDialog,
    private route: Router
    ) { }

  ngOnInit() {
    this.questionnairesService.getAllQuestionnaires();
    this.questionnairesService.questionnairesListSubject.subscribe(data => {
      this.questionnairesList = data;
      /*for (let question of this.questionnairesList) {
        this.onDisplayQuestions(question.id);
      }*/
    });

  }


  /*QUESTIONNAIRES */
  onCreate() {
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    this.dialog.open(QuestionnairesFormComponent, dialogConfig);
  }

  onDeleteQuestionnaire( idQuestionnaire ) {
    const erase = confirm('Voulez vous supprimer ce questionnaire ?');
    if ( erase ) {
      this.questionnairesService.deleteQuestionnaire(idQuestionnaire);
    }
  }

  onEdit( questionnaire: Questionnaires ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = questionnaire;
    this.dialog.open(QuestionnairesDetailComponent, dialogConfig);
  }






  /* QUESTIONS */
  onDisplayQuestions( idQuestionnaire ) {
    this.questionnairesService.getAllQuestions(idQuestionnaire);
    this.questionnairesService.questionsListSubject.subscribe(data => {
      this.questionsList = data;
      this.dataSource = new MatTableDataSource(this.questionsList);
    });
  }

  onAddQuestion(idQuestionnaire) {
    this.route.navigate(['/question-form', idQuestionnaire]);
  }

  onEditQuestion(idQuestion) {
    this.route.navigate(['/question-detail', idQuestion]);
  }

  onDeleteQuestion(idQuestionnaire, idQuestion) {
    this.questionnairesService.deleteQuestion(idQuestionnaire, idQuestion);
  }

}
