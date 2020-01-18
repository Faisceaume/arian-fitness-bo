import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Exercice } from '../exercice';
import { ExercicesService } from '../exercices.service';

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrls: ['./exercice-form.component.css']
})
export class ExerciceFormComponent implements OnInit {

  toppings = new FormControl();
  formData: Exercice;

  categories: string[] = ['categorie1', 'categorie2', 'categorie3', 'categorie4'];

  constructor(private exercicesService: ExercicesService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      categories: []
    } as Exercice;
  }

  onSubmit(form: NgForm): void {
    this.formData.categories = this.toppings.value;
    this.exercicesService.createExercice(this.formData);
  }

}
