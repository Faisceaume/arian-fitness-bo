import { ExercicesSeriesComponent } from './exercices-series.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { SerieDetailsComponent } from './serie-details/serie-details.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: ExercicesSeriesComponent },
  { path: 'serie-details/:id', canActivate: [AuthGuardService], component: SerieDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercicesSeriesRoutingModule { }
