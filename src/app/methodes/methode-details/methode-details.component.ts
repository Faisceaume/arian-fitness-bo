import { Component, OnInit, OnDestroy } from '@angular/core';
import { Methode } from '../methode';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { FormControl } from '@angular/forms';
import { Listes } from 'src/app/shared/listes';
import { ActivatedRoute } from '@angular/router';
import { MethodesService } from '../methodes.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { Objectif } from 'src/app/shared/objectifs/objectif';
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
  objectifs: Objectif[];
  objectifsSelected: Objectif[];
  objectifsNotSelected: Objectif[] = [];
  nbrdeserie: number;

  constructor(private niveauxService: NiveauxService,
              private route: ActivatedRoute,
              private methodesService: MethodesService,
              public categoriesService: CategoriesService,
              private objectifsService: ObjectifsService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    this.listes = new Listes();
    const id = this.route.snapshot.params.id;
    this.methodesService.getSingleMethode(id).then(item => {
      this.formData = item;
      this.nbrdeserie = item.nbrseries;
      this.categoriesService.setListeOfSerie(item.serieexercice as Series[]);
      this.objectifsSelected = item.objectifs;
      this.ordreexercicemodifiableControl.setValue(item.ordreexercicemodifiable);
      this.globalControl.setValue(item.global);
    }).then(() => {
      this.objectifs.forEach(item => {
        const index = this.objectifsSelected.findIndex(it => it.id === item.id);
        if (index < 0) {
          this.objectifsNotSelected.push(item);
        }
      });
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  onValueChange(attribut: string, value: any) {
    this.methodesService.newUpdateVersion(this.formData, attribut, value);
  }

  onObjectifSelected(event, item: Objectif) {
    if (event.checked) {
      this.objectifsSelected.push(item);
      const index = this.objectifsNotSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsNotSelected.splice(index, 1);
      }
    } else {
      this.objectifsNotSelected.push(item);
      const index = this.objectifsSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsSelected.splice(index, 1);
      }
    }
    this.onValueChange('objectifs', this.objectifsSelected);
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
    if (this.categoriesService.listeOfSeries.length > 0) {
      const serieexercice = this.categoriesService.listeOfSeries.map((obj) => {
        return Object.assign({}, obj);
      });
      this.onValueChange('serieexercice', serieexercice);
    }
  }
}
