import { ExercicesSeriesService } from './../exercices-series.service';
import { ExerciceSerie } from './../exercice-serie';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-serie-form',
  templateUrl: './serie-form.component.html',
  styleUrls: ['./serie-form.component.css']
})
export class SerieFormComponent implements OnInit {

  formData: ExerciceSerie;

  constructor(public dialogRef: MatDialogRef<SerieFormComponent>,
              private exercicesSeriesService: ExercicesSeriesService,
              private router: Router) { }

  ngOnInit() {
    this.formData = {
      id: null,
      nom: '',
      type: 'echauffement',
      consigne: '',
      senior: '',
      pathologies: [],
      exercices: []
    } as ExerciceSerie;
  }

  goToEdit() {
    this.exercicesSeriesService.createExerciceSerie(this.formData);
    this.dialogRef.close();
  }

}
