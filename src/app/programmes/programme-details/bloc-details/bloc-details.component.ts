import { CategorieAvance } from './../../categorie-avance';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { MethodesService } from './../../../methodes/methodes.service';
import { Niveau } from './../../../shared/niveaux/niveau';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Bloc } from '../../bloc';
import { Listes } from 'src/app/shared/listes';
import { MethodeAvance } from '../../methode-avance';
import { Methode } from 'src/app/methodes/methode';
import { of } from 'rxjs';

@Component({
  selector: 'app-bloc-details',
  templateUrl: './bloc-details.component.html',
  styleUrls: ['./bloc-details.component.css']
})
export class BlocDetailsComponent implements OnInit, OnDestroy {

  currentBloc: Bloc;
  niveau: Niveau[];
  methodes: any[];
  addCategorieExercice: boolean;
  listeDuree = new Listes().dureemethodes;
  fusionnableControl = new FormControl();
  addCategoriesControl = new FormControl();

  listeDesMethodes: any[] = [];

  constructor(public dialogRef: MatDialogRef<BlocDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private methodesService: MethodesService,
              private categoriesService: CategoriesService) { }

  ngOnInit() {

    this.categoriesService.chipsSelectedForOperation = [];
    this.niveau = this.data.niveau;

    if (this.data.currentBloc) {
      this.currentBloc = this.data.currentBloc;
      this.listeDesMethodes = this.data.currentBloc.methodes;
      this.fusionnableControl.setValue(this.data.currentBloc.fusionnable);
      if (this.data.currentBloc.categoriesexercices.length !== 0) {
        this.addCategoriesControl.setValue(true);
      }
    } else {
      this.currentBloc = new Bloc();
      this.updateField();
    }

  }

  updateField() {
    this.listeDesMethodes = [];

    this.niveau.forEach((item: Niveau) => {
      this.methodesService
      .getMethodesForProgramme(item, this.currentBloc.orientation, this.currentBloc.duree);
      this.methodesService.methodesForProgrammeSubject.subscribe((data: Methode[]) => {
        data.forEach((it: Methode) => {
          const position = this.listeDesMethodes.findIndex(itt => itt.id === it.id);
          if (position < 0) {
            this.listeDesMethodes.push(it);
          }
        });
      });
    });
  }

  formatClass() {
    const all = [];
    this.listeDesMethodes.forEach(data => {
      const local = new MethodeAvance();
      local.acronyme = data.acronyme;
      local.id = data.id;
      local.nom = data.nom;
      all.push(Object.assign({}, local));
    });
    this.currentBloc.methodes = all;
  }

  deleteMethode(id: number) {
    this.listeDesMethodes.splice(id, 1);
  }

  ngOnDestroy(): void {
    this.formatClass();
    if (this.categoriesService.chipsSelectedForOperation.length !== 0) {
          const cat = [];
          this.categoriesService.chipsSelectedForOperation.forEach(data => {
          const localCat = new CategorieAvance();
          localCat.id = data.id;
          localCat.nom = data.nom;
          localCat.acronyme = data.acronyme;
          localCat.duree = data.duree;
          cat.push(Object.assign({}, localCat));
           });
          this.currentBloc.categoriesexercices = cat;
    }

    if (!this.addCategoriesControl.value) {
      this.currentBloc.categoriesexercices = [];
    }

  }

}
