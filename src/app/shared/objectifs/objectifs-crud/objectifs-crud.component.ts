import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjectifsService } from '../objectifs.service';
import { Objectif } from '../objectif';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-objectifs-crud',
  templateUrl: './objectifs-crud.component.html',
  styleUrls: ['./objectifs-crud.component.css']
})
export class ObjectifsCrudComponent implements OnInit {

  toCreate: boolean;
  formData: Objectif;
  premiumControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<ObjectifsCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private objectifsService: ObjectifsService) { }

  ngOnInit() {
    if (this.data) {
      this.formData = this.data;
      this.premiumControl.setValue(this.formData.premium);
    } else {
      this.formData = {
        id: null,
        nom: '',
        acronyme: '',
        premium: false,
        timestamp: 0
      } as Objectif;

      this.toCreate = true;
    }
  }

  onSubmit() {
    if (this.premiumControl.value) {
      this.formData.premium = this.premiumControl.value;
    }
    this.objectifsService.createObjectif(this.formData);
    this.closeDialog();
  }

  updateField(attribut: string, value: any) {
    if (this.formData.id) {
      this.objectifsService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
