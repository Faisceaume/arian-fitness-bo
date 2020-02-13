import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciceFormComponent } from './exercice-form/exercice-form.component';
import { ExerciceDetailsComponent } from './exercice-details/exercice-details.component';
import { ExercicesListComponent } from './exercices-list/exercices-list.component';
import { ExercicesRoutingModule } from './exercices-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ExercicesSeriesComponent } from './exercices-series/exercices-series.component';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [ExerciceFormComponent, ExerciceDetailsComponent, ExercicesListComponent, ExercicesSeriesComponent],
  imports: [
    SharedModule,
    CommonModule,
    ExercicesRoutingModule,
    MatExpansionModule
  ]
})
export class ExercicesModule { }
