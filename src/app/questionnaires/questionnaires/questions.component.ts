import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { QuestionnairesService } from '../questionnaires.service';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatTable, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Questionnaires } from '../questionnaires';
import { Router, ActivatedRoute } from '@angular/router';
import { Questions } from '../questions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @ViewChild('table', {static: false}) table: MatTable<Questions>;

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
    });

  }


  /*QUESTIONNAIRES */
  onCreate() {
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    this.dialog.open( QuestionnairesFormComponent, dialogConfig);
  }

  onDeleteQuestionnaire( idQuestionnaire ) {
    const erase = confirm('Voulez vous supprimer ce questionnaire ?');
    if ( erase ) {
      this.questionnairesService.deleteQuestionnaire(idQuestionnaire);
    }
  }

  onEdit( questionnaire: Questionnaires ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
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

  updateActiveField(idQuestionnaire, idQuestion, active) {
    if (active) {
      this.questionnairesService.updateActiveField(idQuestionnaire, idQuestion, true);
    } else {
      this.questionnairesService.updateActiveField(idQuestionnaire, idQuestion, false);
    }
  }

  onListDrop(event: CdkDragDrop<Questions[]>) {
    console.log(event.item.data, event.currentIndex);
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
  }



}


/*********************************************/
/*********************************************/
/******************* FORM  ******************/
/*********************************************/
/*********************************************/


@Component({
  selector: 'app-questionnaires-form',
  templateUrl: './questionnaires-form.component.html',
})
export class QuestionnairesFormComponent implements OnInit {

  questionnairesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private questionnairesService: QuestionnairesService,
    public dialogRef: MatDialogRef<QuestionnairesFormComponent>
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.questionnairesForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  onAdd() {
    const name = this.questionnairesForm.get('name').value;
    const time = new Date().getTime();
    this.questionnairesService.createQuestionnaire(name, time);
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

}


/*********************************************/
/*********************************************/
/******************* EDIT ******************/
/*********************************************/
/*********************************************/

@Component({
  selector: 'app-questionnaires-detail',
  templateUrl: 'questionnaires-detail.component.html',
})
export class QuestionnairesDetailComponent implements OnInit {

  questionnairesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private questionnairesService: QuestionnairesService,
    public dialogRef: MatDialogRef<QuestionnairesDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Questionnaires
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.questionnairesForm = this.formBuilder.group({
      name: [ this.data.name, Validators.required]
    });
  }

  onEdit() {
    const name = this.questionnairesForm.get('name').value;
    this.questionnairesService.updateQuestionnaire(this.data.id, name, new Date().getTime());
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

}