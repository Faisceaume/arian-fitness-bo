import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AccueilComponent } from './accueil/accueil.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path : 'auth', component : AuthComponent },
  { path : 'home', component : AccueilComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'exercices', canActivate: [AuthGuardService],
    loadChildren: () => import('./exercices/exercices.module').then(mod => mod.ExercicesModule)
  },
  {
    path: 'materiels',
    loadChildren: () => import('./materiels/materiels.module').then(mod => mod.MaterielsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
