import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionnairesService } from '../../questionnaires.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-questionnaires-form',
  templateUrl: './questionnaires-form.component.html',
  styleUrls: ['./questionnaires-form.component.css']
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
