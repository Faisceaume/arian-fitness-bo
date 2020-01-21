import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Exercice } from '../exercice';
import { ExercicesService } from '../exercices.service';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/shared/categories-section/categories.service';
import { Categorie } from 'src/app/shared/categories-section/categorie';

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrls: ['./exercice-form.component.css']
})
export class ExerciceFormComponent implements OnInit, OnDestroy {

  formData: Exercice;
  subscription: Subscription;
  categories: Categorie[];

  constructor(private exercicesService: ExercicesService,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      categories: []
    } as Exercice;

    this.categoriesService.getAllCategories('exerc_cat');
    this.subscription = this.categoriesService.categorieSubject.subscribe(data => {
      this.categories = data;
    });

  }

  onSubmit(form: NgForm): void {
    this.formData.categories = this.categoriesService.chipsSelectedForOperation;
    this.exercicesService.createExercice(this.formData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
