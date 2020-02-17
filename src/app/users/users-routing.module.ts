import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { UsersComponent } from './users.component';
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: UsersComponent },
    { path: 'user-details/:id', canActivate: [AuthGuardService], component: UserDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }