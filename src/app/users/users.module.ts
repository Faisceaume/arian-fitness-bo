import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [UsersComponent, UserFormComponent, UserDetailsComponent],
  imports: [
    SharedModule,
    CommonModule,
    UsersRoutingModule
  ],
  entryComponents: [UserFormComponent]
})
export class UsersModule { }
