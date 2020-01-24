import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionnairesService } from '../../questionnaires.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Questionnaires } from '../../questionnaires';

@Component({
  selector: 'app-questionnaires-detail',
  templateUrl: './questionnaires-detail.component.html',
  styleUrls: ['./questionnaires-detail.component.css']
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
    this.questionnairesService.updateQuestionnaire(this.data.id, name, new Date());
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

}
