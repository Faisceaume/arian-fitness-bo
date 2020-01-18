import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Exercice } from '../exercice';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercicesService } from '../exercices.service';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit {

  toppings = new FormControl();
  formData: Exercice;

  categories: string[] = ['categorie1', 'categorie2', 'categorie3', 'categorie4'];

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private router: Router) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then(
                  (item: Exercice) => {
                    this.formData = item;
                    this.toppings.setValue(this.formData.categories);
                  }
                );
  }

  onSubmit() {
    this.formData.categories = this.toppings.value;
    this.exercicesService.updateExercice(this.formData);
    this.router.navigate(['exercices']);
  }

}
