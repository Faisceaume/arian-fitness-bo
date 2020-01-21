import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { InitCategoriesComponent } from './init-categories/init-categories.component';
import { SharedModule } from '../shared/shared.module';
import { CategorieFormComponent } from './categorie-form/categorie-form.component';
import { CategorieDetailsComponent } from './categorie-details/categorie-details.component';


@NgModule({
  declarations: [CategoriesListComponent, InitCategoriesComponent, CategorieFormComponent, CategorieDetailsComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule { }
