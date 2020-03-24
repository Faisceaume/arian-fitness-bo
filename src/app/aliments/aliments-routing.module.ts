import { AlimentFormComponent } from './aliment-form/aliment-form.component';
import { AlimentsComponent } from './aliments.component';
import { AlimentDetailsComponent } from './aliment-details/aliment-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: AlimentsComponent },
    { path: 'aliment-form', canActivate: [AuthGuardService], component: AlimentFormComponent },
    { path: ':id', canActivate: [AuthGuardService], component: AlimentDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlimentsRoutingModule { }
