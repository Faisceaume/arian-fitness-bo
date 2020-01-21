import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Exercice } from '../exercice';
import { ExercicesService } from '../exercices.service';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Categorie } from 'src/app/categories/categorie';

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrls: ['./exercice-form.component.css']
})
export class ExerciceFormComponent implements OnInit, OnDestroy {

  formData: Exercice;
  subscription: Subscription;
  categories: Categorie[];
  chipsSelected: string[] = [];

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

  selectMe(event: any) {
    if (event.selected) {
      event.selected = false;
      this.removeChips(event as Categorie);
    } else {
      event.selected = true;
      this.addChips(event as Categorie);
    }
  }

  addChips(item: Categorie) {
    this.chipsSelected.push(item.nom);
  }

  removeChips(item: Categorie) {
    const index = this.chipsSelected.indexOf(item.nom);
    if (index >= 0) {
      this.chipsSelected.splice(index, 1);
    }
  }

  onSubmit(form: NgForm): void {
    this.formData.categories = this.chipsSelected;
    this.exercicesService.createExercice(this.formData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
