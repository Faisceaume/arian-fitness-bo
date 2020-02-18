import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeDetailsComponent } from './programme-details/programme-details.component';
import { ProgrammesListComponent } from './programmes-list/programmes-list.component';
import { ProgrammesRoutingModule } from './programmes-routing.module';
import { ProgrammeFormComponent } from './programme-form/programme-form.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ProgrammeDetailsComponent, ProgrammesListComponent, ProgrammeFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    ProgrammesRoutingModule
  ],
  entryComponents: [ProgrammeFormComponent]
})
export class ProgrammesModule { }
