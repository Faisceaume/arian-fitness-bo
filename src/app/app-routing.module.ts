import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifsComponent } from './shared/objectifs/objectifs.component';
import { NiveauxComponent } from './shared/niveaux/niveaux.component';
import { PathologiesComponent } from './shared/pathologies/pathologies.component';
import { QuestionsComponent } from './questionnaires/questionnaires/questions.component';
import { QuestionsFormComponent } from './questionnaires/questionnaires/questions-form/questions-form.component';
import { QuestionsDetailComponent } from './questionnaires/questionnaires/questions-detail/questions-detail.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path : 'auth', component : AuthComponent },
  { path : 'home', canActivate: [AuthGuardService], component : AccueilComponent },
  { path : 'objectifs', canActivate: [AuthGuardService], component : ObjectifsComponent },
  { path : 'niveaux', canActivate: [AuthGuardService], component : NiveauxComponent },
  { path : 'pathologies', canActivate: [AuthGuardService], component : PathologiesComponent },
  { path : 'users', canActivate: [AuthGuardService], component : UsersComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'exercices', canActivate: [AuthGuardService],
    loadChildren: () => import('./exercices/exercices.module').then(mod => mod.ExercicesModule)
  },
  {
    path: 'materiels', canActivate: [AuthGuardService],
    loadChildren: () => import('./materiels/materiels.module').then(mod => mod.MaterielsModule)
  },
  {
    path: 'methodes', canActivate: [AuthGuardService],
    loadChildren: () => import('./methodes/methodes.module').then(mod => mod.MethodesModule)
  },
  {
    path: 'programmes', canActivate: [AuthGuardService],
    loadChildren: () => import('./programmes/programmes.module').then(mod => mod.ProgrammesModule)
  },
  { path: 'questionnaires', canActivate: [AuthGuardService], component: QuestionsComponent },
  {path: 'question-form/:idQuestionnaire', canActivate: [AuthGuardService], component: QuestionsFormComponent},
  {path: 'question-detail/:idQuestion', canActivate: [AuthGuardService], component: QuestionsDetailComponent},
  {
    path: 'users', canActivate: [AuthGuardService],
    loadChildren: () => import('./users/users.module').then(mod => mod.UsersModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
