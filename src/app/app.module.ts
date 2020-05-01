import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';

import { AuthComponent } from './auth/auth.component';
import { AccueilComponent } from './accueil/accueil.component';
import { UiModule } from './ui/ui.module';
import { MatDialogRef } from '@angular/material/dialog';

import { QuestionnairesModule } from './questionnaires/questionnaires.module';
import { UsersModule } from './users/users.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AccueilComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    UiModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    QuestionnairesModule,
    UsersModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
