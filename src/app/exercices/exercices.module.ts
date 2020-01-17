import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciceFormComponent } from './exercice-form/exercice-form.component';
import { ExerciceDetailsComponent } from './exercice-details/exercice-details.component';
import { ExercicesListComponent } from './exercices-list/exercices-list.component';



@NgModule({
  declarations: [ExerciceFormComponent, ExerciceDetailsComponent, ExercicesListComponent],
  imports: [
    CommonModule
  ]
})
export class ExercicesModule { }
