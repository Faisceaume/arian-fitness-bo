import { MatDialogRef } from '@angular/material/dialog';
import { NutritionService } from './../nutrition.service';
import { Component, OnInit } from '@angular/core';
import { Prognut } from '../prognut';

@Component({
  selector: 'app-prognut-form',
  templateUrl: './prognut-form.component.html',
  styleUrls: ['./prognut-form.component.css']
})
export class PrognutFormComponent implements OnInit {

  formData: Prognut;

  constructor(public dialogRef: MatDialogRef<PrognutFormComponent>,
              private nutritionService: NutritionService) { }

  ngOnInit() {
    this.formData = {
      id: null,
      nom: '',
      objectif: null,
      nbrescenarios: null,
    } as Prognut;
  }

  onSave() {
    this.nutritionService.createProgNut(this.formData);
    this.dialogRef.close();
  }
}
