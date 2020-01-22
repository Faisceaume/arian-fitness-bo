import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Exercice } from '../exercice';
import { ExercicesService } from '../exercices.service';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { Categorie } from 'src/app/shared/categories/categorie';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CategoriesCrudComponent } from 'src/app/shared/categories/categories-crud/categories-crud.component';

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
              private categoriesService: CategoriesService,
              private matDialog: MatDialog) { }

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

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = 'exerc_cat';
    this.matDialog.open(CategoriesCrudComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
