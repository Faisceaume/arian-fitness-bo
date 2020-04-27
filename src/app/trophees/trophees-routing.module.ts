import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TropheeDetailsComponent } from './trophee-details/trophee-details.component';
import { TropheesListComponent } from './trophees-list/trophees-list.component';


const routes: Routes = [
  { path: '', component: TropheesListComponent },
  { path: ':id', component: TropheeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TropheesRoutingModule { }
