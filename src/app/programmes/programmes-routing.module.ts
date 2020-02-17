import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgrammesListComponent } from './programmes-list/programmes-list.component';
import { ProgrammeDetailsComponent } from './programme-details/programme-details.component';
import { ProgrammeFormComponent } from './programme-form/programme-form.component';


const routes: Routes = [
  { path: '', component: ProgrammesListComponent },
   { path: 'programme-form', component: ProgrammeFormComponent },
  { path: ':id', component: ProgrammeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammesRoutingModule { }
