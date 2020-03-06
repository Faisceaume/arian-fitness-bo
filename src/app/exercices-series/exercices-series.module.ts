import { ExercicesSeriesComponent } from './exercices-series.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercicesSeriesRoutingModule } from './exercices-series-routing.module';
import { SerieDetailsComponent } from './serie-details/serie-details.component';
import { SerieFormComponent } from './serie-form/serie-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ExercicesSeriesComponent,
                 SerieDetailsComponent,
                SerieFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    ExercicesSeriesRoutingModule
  ],
  entryComponents: [SerieFormComponent]
})
export class ExercicesSeriesModule { }
