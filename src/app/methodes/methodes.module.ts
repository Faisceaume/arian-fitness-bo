import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MethodesRoutingModule } from './methodes-routing.module';
import { MethodesListComponent } from './methodes-list/methodes-list.component';
import { MethodeFormComponent } from './methode-form/methode-form.component';
import { MethodeDetailsComponent } from './methode-details/methode-details.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MethodesListComponent, MethodeFormComponent, MethodeDetailsComponent],
  imports: [
    SharedModule,
    CommonModule,
    MethodesRoutingModule
  ]
})
export class MethodesModule { }
