import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { Categorie } from 'src/app/categories/categorie';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit, OnDestroy {

  formData: Exercice;
  categories: Categorie[];
  chipsSelected: string[];
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private router: Router,
              private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then( (item: Exercice) => {
          this.formData = item;
          this.chipsSelected = this.formData.categories;
          } ).then( () => {
                  this.getAllCategorie();
        }
    );
  }

  getAllCategorie() {
    this.categoriesService.getAllCategories('exerc_cat');
    this.subscription = this.categoriesService.categorieSubject.subscribe(data => {
        this.categories = data;
        this.categories.forEach((item, index) => {
            if (this.chipsSelected.indexOf(item.nom) >= 0) {
                    this.categories[index].selected = true;
               }
            });
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
    this.onValueChange('categories', this.chipsSelected);
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

  onValueChange(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
