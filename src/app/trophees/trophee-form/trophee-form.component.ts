import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Trophee } from '../trophee';
import { MatDialogRef } from '@angular/material';
import { TropheesService } from '../trophees.service';

@Component({
  selector: 'app-trophee-form',
  templateUrl: './trophee-form.component.html',
  styleUrls: ['./trophee-form.component.css']
})
export class TropheeFormComponent implements OnInit {

  formData: Trophee;

  constructor(
    public dialogRef: MatDialogRef<TropheeFormComponent>,
    private tropheesService: TropheesService
    ) { }

  ngOnInit() {
    this.formData = {
      $id: null,
      nom: '',
      details: '',
      explications: '',
      timestamp: null,
      image: ''
    }
  }

  onSubmit() {
    this.tropheesService.createNewTrophee(this.formData);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
