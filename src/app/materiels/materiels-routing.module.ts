import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { MaterielsListComponent } from './materiels-list/materiels-list.component';
import { MaterielFormComponent } from './materiel-form/materiel-form.component';
import { MaterielDetailsComponent } from './materiel-details/materiel-details.component';


const routes: Routes = [
    { path: '', component: MaterielsListComponent },
    { path: 'materiel-form', component: MaterielFormComponent },
    { path: ':id', component: MaterielDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterielsRoutingModule { }
