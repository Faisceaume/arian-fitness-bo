import { SharedModule } from 'src/app/shared/shared.module';
import { AlimentsRoutingModule } from './aliments-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlimentsComponent } from './aliments.component';
import { AlimentDetailsComponent } from './aliment-details/aliment-details.component';
import { AlimentFormComponent } from './aliment-form/aliment-form.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [AlimentsComponent, AlimentDetailsComponent, AlimentFormComponent, SearchComponent],
  imports: [
    SharedModule,
    CommonModule,
    AlimentsRoutingModule
  ],
  entryComponents: [AlimentFormComponent]
})
export class AlimentsModule { }
