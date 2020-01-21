import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { InitCategoriesComponent } from './init-categories/init-categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategorieFormComponent } from './categorie-form/categorie-form.component';
import { CategorieDetailsComponent } from './categorie-details/categorie-details.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: InitCategoriesComponent },
  { path: ':noeud', canActivate: [AuthGuardService], component: CategoriesListComponent },
  { path: ':noeud/categorie-form', canActivate: [AuthGuardService], component: CategorieFormComponent },
  { path: ':noeud/categorie-details/:id', canActivate: [AuthGuardService], component: CategorieDetailsComponent }
  // { path: 'exercice-form', canActivate: [AuthGuardService], component: ExerciceFormComponent },
  // { path: ':id', canActivate: [AuthGuardService], component: ExerciceDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
