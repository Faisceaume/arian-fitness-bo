import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeDetailsComponent } from './programme-details/programme-details.component';
import { ProgrammesListComponent } from './programmes-list/programmes-list.component';
import { ProgrammesRoutingModule } from './programmes-routing.module';
import { ProgrammeFormComponent } from './programme-form/programme-form.component';



@NgModule({
  declarations: [ProgrammeDetailsComponent, ProgrammesListComponent, ProgrammeFormComponent],
  imports: [
    CommonModule,
    ProgrammesRoutingModule
  ]
})
export class ProgrammesModule { }
