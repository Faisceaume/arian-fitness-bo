import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeDetailsComponent } from './programme-details/programme-details.component';
import { ProgrammesListComponent } from './programmes-list/programmes-list.component';



@NgModule({
  declarations: [ProgrammeDetailsComponent, ProgrammesListComponent],
  imports: [
    CommonModule
  ]
})
export class ProgrammesModule { }
