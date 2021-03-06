import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { ExercicesListComponent } from './exercices-list/exercices-list.component';
import { ExerciceFormComponent } from './exercice-form/exercice-form.component';
import { ExerciceDetailsComponent } from './exercice-details/exercice-details.component';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: ExercicesListComponent },
    { path: 'exercice-form', canActivate: [AuthGuardService], component: ExerciceFormComponent },
    { path: ':id', canActivate: [AuthGuardService], component: ExerciceDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercicesRoutingModule { }
