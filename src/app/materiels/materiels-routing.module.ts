import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { MaterielsListComponent } from './materiels-list/materiels-list.component';
import { MaterielFormComponent } from './materiel-form/materiel-form.component';
import { MaterielDetailsComponent } from './materiel-details/materiel-details.component';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: MaterielsListComponent },
    { path: 'materiel-form', canActivate: [AuthGuardService], component: MaterielFormComponent },
    { path: ':id', canActivate: [AuthGuardService], component: MaterielDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterielsRoutingModule { }
