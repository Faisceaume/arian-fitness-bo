import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questions/questions.component';
import { SharedModule } from '../shared/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import { QuestionnairesFormComponent } from './questions/questionnaires-form/questionnaires-form.component';
import { QuestionnairesDetailComponent } from './questions/questionnaires-detail/questionnaires-detail.component';



@NgModule({
  declarations: [QuestionsComponent, QuestionnairesFormComponent, QuestionnairesDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    MatDialogModule
  ],
  entryComponents : [ QuestionnairesFormComponent, QuestionnairesDetailComponent ]
})
export class QuestionnairesModule { }
