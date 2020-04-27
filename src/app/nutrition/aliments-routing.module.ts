import { PrognutDetailsComponent } from './prognut-details/prognut-details.component';
import { PrognutFormComponent } from './prognut-form/prognut-form.component';
import { PrognutsListComponent } from './prognuts-list/prognuts-list.component';
import { AlimentFormComponent } from './aliment-form/aliment-form.component';
import { AlimentsComponent } from './aliments.component';
import { AlimentDetailsComponent } from './aliment-details/aliment-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: AlimentsComponent },
    { path: 'aliment-form', canActivate: [AuthGuardService], component: AlimentFormComponent },
    { path: 'search', canActivate: [AuthGuardService], component: SearchComponent },
    { path: 'prognuts-list', canActivate: [AuthGuardService], component: PrognutsListComponent },
    { path: 'prognut-form', canActivate: [AuthGuardService], component: PrognutFormComponent },
    { path: 'prognuts/:id', canActivate: [AuthGuardService], component: PrognutDetailsComponent },
    { path: ':id', canActivate: [AuthGuardService], component: AlimentDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlimentsRoutingModule { }
