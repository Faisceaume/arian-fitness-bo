import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserSeanceComponent } from './user-seance/user-seance.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';

@NgModule({
  declarations: [UsersComponent, UserFormComponent, UserDetailsComponent, UserSeanceComponent, UserQuestionsComponent],
  imports: [
    SharedModule,
    CommonModule,
    UsersRoutingModule
  ],
  entryComponents: [UserFormComponent]
})
export class UsersModule { }
