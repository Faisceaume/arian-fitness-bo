import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../questionnaires.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { QuestionnairesFormComponent } from './questionnaires-form/questionnaires-form.component';
import { Questionnaires } from '../questionnaires';
import { QuestionnairesDetailComponent } from './questionnaires-detail/questionnaires-detail.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questionnairesList: Questionnaires[];

  constructor(
    private questionnairesService: QuestionnairesService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.questionnairesService.getAllQuestionnaires();
    this.questionnairesService.questionnairesListSubject.subscribe(data => {
      this.questionnairesList = data;
    });
  }

  onCreate() {
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    this.dialog.open(QuestionnairesFormComponent, dialogConfig);
  }

  onDelete( idQuestionnaire ) {
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

}
