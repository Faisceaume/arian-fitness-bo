import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MethodesListComponent } from './methodes-list/methodes-list.component';
import { MethodeFormComponent } from './methode-form/methode-form.component';
import { MethodeDetailsComponent } from './methode-details/methode-details.component';


const routes: Routes = [
  { path: '', component: MethodesListComponent },
  { path: 'methode-form', component: MethodeFormComponent },
  { path: ':id', component: MethodeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodesRoutingModule { }
