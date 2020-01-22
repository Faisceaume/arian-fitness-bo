import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path : 'auth', component : AuthComponent },
  { path : 'home', canActivate: [AuthGuardService], component : HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
