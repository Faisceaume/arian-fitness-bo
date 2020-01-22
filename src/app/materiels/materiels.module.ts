import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterielDetailsComponent } from './materiel-details/materiel-details.component';
import { MaterielsListComponent } from './materiels-list/materiels-list.component';
import { MaterielsRoutingModule } from './materiels-routing.module';
import { MaterielFormComponent } from './materiel-form/materiel-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MaterielDetailsComponent, MaterielsListComponent, MaterielFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    MaterielsRoutingModule
  ]
})
export class MaterielsModule { }
