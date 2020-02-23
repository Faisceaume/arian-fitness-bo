import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgrammesListComponent } from './programmes-list/programmes-list.component';
import { ProgrammeDetailsComponent } from './programme-details/programme-details.component';


const routes: Routes = [
  { path: '', component: ProgrammesListComponent },
  { path: ':id', component: ProgrammeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammesRoutingModule { }
