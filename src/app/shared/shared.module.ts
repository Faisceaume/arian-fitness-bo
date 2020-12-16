import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatPaginatorModule, MatSortModule, MatNativeDateModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatMenuModule } from '@angular/material';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { CategoriesComponent } from './categories/categories.component';
import { CategoriesCrudComponent } from './categories/categories-crud/categories-crud.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { NiveauxComponent } from './niveaux/niveaux.component';
import { PathologiesComponent } from './pathologies/pathologies.component';
import { ObjectifsCrudComponent } from './objectifs/objectifs-crud/objectifs-crud.component';
import { NiveauxCrudComponent } from './niveaux/niveaux-crud/niveaux-crud.component';
import { PathologiesCrudComponent } from './pathologies/pathologies-crud/pathologies-crud.component';
import { MaterielsSharedComponent } from './materiels-shared/materiels-shared.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { UploadVideosComponent } from './upload-videos/upload-videos.component';

const modules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTooltipModule,
    MatListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule
];

@NgModule({
  declarations: [CategoriesComponent,
                 CategoriesCrudComponent,
                 ObjectifsComponent,
                 NiveauxComponent,
                PathologiesComponent,
                ObjectifsCrudComponent,
                NiveauxCrudComponent,
                PathologiesCrudComponent,
                MaterielsSharedComponent,
                UploadImagesComponent,
                UploadVideosComponent],
  imports: [
    ...modules,
  ],
  exports: [
    ...modules,
    CategoriesComponent,
    ObjectifsComponent,
    UploadImagesComponent,
    UploadVideosComponent
],
providers: [
  MatDatepickerModule,
],
entryComponents: [CategoriesCrudComponent,
                  ObjectifsCrudComponent,
                  NiveauxCrudComponent,
                  PathologiesCrudComponent,
                  MaterielsSharedComponent,
                  CategoriesComponent]
})
export class SharedModule {

 }
