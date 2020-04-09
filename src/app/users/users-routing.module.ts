import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { UsersComponent } from './users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserSeanceComponent } from './user-seance/user-seance.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';


const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: UsersComponent },
    { path: 'user-details/:id', canActivate: [AuthGuardService], component: UserDetailsComponent },
    { path: 'user-seance/:id', canActivate: [AuthGuardService], component: UserSeanceComponent },
    { path: 'user-questions', canActivate: [AuthGuardService], component: UserQuestionsComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
