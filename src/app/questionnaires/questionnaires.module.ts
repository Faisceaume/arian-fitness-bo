import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questionnaires/questions.component';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule} from '@angular/material/dialog';
import { QuestionnairesFormComponent } from './questionnaires/questions.component';
import { QuestionnairesDetailComponent } from './questionnaires/questions.component';
import { QuestionsFormComponent } from './questionnaires/questions-form/questions-form.component';
import { QuestionsDetailComponent } from './questionnaires/questions-detail/questions-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


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
    MatDialogModule,
    DragDropModule
  ],
  entryComponents : [ QuestionnairesFormComponent, QuestionnairesDetailComponent ]
})
export class QuestionnairesModule { }
