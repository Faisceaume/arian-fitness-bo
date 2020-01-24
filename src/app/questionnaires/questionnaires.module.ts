import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questionnaires/questions.component';
import { SharedModule } from '../shared/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import { QuestionnairesFormComponent } from './questionnaires/questionnaires-form/questionnaires-form.component';
import { QuestionnairesDetailComponent } from './questionnaires/questionnaires-detail/questionnaires-detail.component';
import { QuestionsFormComponent } from './questionnaires/questions-form/questions-form.component';
import { QuestionsDetailComponent } from './questionnaires/questions-detail/questions-detail.component';



@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionsFormComponent,
    QuestionsDetailComponent,
    QuestionnairesFormComponent,
    QuestionnairesDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    MatDialogModule
  ],
  entryComponents : [ QuestionnairesFormComponent, QuestionnairesDetailComponent ]
})
export class QuestionnairesModule { }
