import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TropheeDetailsComponent } from './trophee-details/trophee-details.component';
import { TropheeFormComponent } from './trophee-form/trophee-form.component';
import { TropheesListComponent } from './trophees-list/trophees-list.component';


@NgModule({
  declarations: [TropheeDetailsComponent, TropheeFormComponent, TropheesListComponent],
  imports: [
    CommonModule
  ]
})
export class TropheesModule { }
