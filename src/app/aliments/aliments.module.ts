import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlimentsComponent } from './aliments.component';
import { AlimentDetailsComponent } from './aliment-details/aliment-details.component';


@NgModule({
  declarations: [AlimentsComponent, AlimentDetailsComponent],
  imports: [
    CommonModule
  ]
})
export class AlimentsModule { }
