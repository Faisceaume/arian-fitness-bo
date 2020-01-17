import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterielDetailsComponent } from './materiel-details/materiel-details.component';
import { MaterielsListComponent } from './materiels-list/materiels-list.component';



@NgModule({
  declarations: [MaterielDetailsComponent, MaterielsListComponent],
  imports: [
    CommonModule
  ]
})
export class MaterielsModule { }
