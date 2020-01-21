import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciceFormComponent } from './exercice-form/exercice-form.component';
import { ExerciceDetailsComponent } from './exercice-details/exercice-details.component';
import { ExercicesListComponent } from './exercices-list/exercices-list.component';
import { ExercicesRoutingModule } from './exercices-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ExerciceFormComponent, ExerciceDetailsComponent, ExercicesListComponent],
  imports: [
    SharedModule,
    CommonModule,
    ExercicesRoutingModule
  ]
})
export class ExercicesModule { }
