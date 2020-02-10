import { Component, OnInit, OnDestroy } from '@angular/core';
import { Methode } from '../methode';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { FormControl } from '@angular/forms';
import { Listes } from 'src/app/shared/listes';
import { ActivatedRoute } from '@angular/router';
import { MethodesService } from '../methodes.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { Series } from 'src/app/shared/series';
import { Categorie } from 'src/app/shared/categories/categorie';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CategoriesComponent } from 'src/app/shared/categories/categories.component';

@Component({
  selector: 'app-methode-details',
  templateUrl: './methode-details.component.html',
  styleUrls: ['./methode-details.component.css']
})
export class MethodeDetailsComponent implements OnInit, OnDestroy {

  listes: Listes;
  niveaux: Niveau[];
  formData: Methode;
  isLinear = false;
  ordreexercicemodifiableControl = new FormControl();
  globalControl = new FormControl();
  toChangeNiveau: boolean;
  nbrdeserie: number;

  constructor(private niveauxService: NiveauxService,
              private route: ActivatedRoute,
              private methodesService: MethodesService,
              public categoriesService: CategoriesService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.listes = new Listes();
    const id = this.route.snapshot.params.id;
    this.methodesService.getSingleMethode(id).then(item => {
      this.formData = item;
      this.nbrdeserie = item.nbrseries;
      this.categoriesService.setListeOfSerie(item.serieexercice as Series[]);
      this.globalControl.setValue(item.global);
    }).then(() => {
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  onValueChange(attribut: string, value: any) {
    this.methodesService.newUpdateVersion(this.formData, attribut, value);
    if (attribut === 'nbrseries') {
      this.nbrdeserie = value;
      this.categoriesService.initialiseListeOfSeries(value);
    }
  }


  fonction(index: number) {
    this.categoriesService.setIndexValue(index);
    this.openMatDialog();
  }

  openMatDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.matDialog.open(CategoriesComponent, dialogConfig);
  }

  onDeleteCategorie(cat: Categorie, index: number) {
    const position = this.categoriesService.listeOfSeries[index].categories.findIndex(it => it.id === cat.id);
    if (position >= 0) {
      this.categoriesService.listeOfSeries[index].categories.splice(position, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.categoriesService.listeOfSeries) {
      if (this.categoriesService.listeOfSeries.length > 0) {
        const serieexercice = this.categoriesService.listeOfSeries.map((obj) => {
          return Object.assign({}, obj);
        });
        this.onValueChange('serieexercice', serieexercice);
      }
    }
  }
}
