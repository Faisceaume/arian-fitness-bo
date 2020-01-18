import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], redirectTo: 'home', pathMatch: 'full' },
  { path : 'auth', component : AuthComponent },
  { path : 'home', canActivate: [AuthGuardService], component : HomeComponent },
  {
    path: 'exercices', canActivate: [AuthGuardService],
    loadChildren: () => import('./exercices/exercices.module').then(mod => mod.ExercicesModule)
  },
  {
    path: 'materiels', canActivate: [AuthGuardService],
    loadChildren: () => import('./materiels/materiels.module').then(mod => mod.MaterielsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
