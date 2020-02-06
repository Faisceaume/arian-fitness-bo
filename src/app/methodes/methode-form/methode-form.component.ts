import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { Listes } from 'src/app/shared/listes';
import { Methode } from '../methode';
import { MethodesService } from '../methodes.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CategoriesComponent } from 'src/app/shared/categories/categories.component';
import { Categorie } from 'src/app/shared/categories/categorie';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';

@Component({
  selector: 'app-methode-form',
  templateUrl: './methode-form.component.html',
  styleUrls: ['./methode-form.component.css']
})
export class MethodeFormComponent implements OnInit {

  formData: Methode;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ordreexercicemodifiableControl = new FormControl();
  globalControl = new FormControl();
  niveaux: Niveau[];
  listes: Listes;
  objectifs: Objectif[];
  objectifsSelected: Objectif[];
  objectifsNotSelected: Objectif[] = [];

  // pour les séries d'exercice
  nbrdeserie: number;

  constructor(private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private methodesService: MethodesService,
              public categoriesService: CategoriesService,
              private matDialog: MatDialog,
              private objectifsService: ObjectifsService) { }

  ngOnInit() {
    this.listes = new Listes();
    this.firstFormGroup = this.formBuilder.group({
      nom: ['', Validators.required],
      acronyme: ['', Validators.required],
      dureeminimum: ['', Validators.required],
      consigne: ['', Validators.required],
      orientation: ['renforcement', Validators.required],
      niveau: ['', Validators.required],
      senior : ['avec', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      nbrexparserie: [null, Validators.required],
      nbrexercicesminimum: [null, Validators.required],
      nbrseries: [null, Validators.required],
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
      this.objectifsSelected = data;
    });

    this.secondFormGroup.get('nbrseries').valueChanges.subscribe((item: number) => {
      this.nbrdeserie = item;
      this.categoriesService.initialiseListeOfSeries(item);
    });

    this.categoriesService.listeOfSeries = [];
  }

  setFormDataValue() {
    this.formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
    } as Methode;

    this.formData.objectifs = this.objectifsSelected;
    this.formData.ordreexercicemodifiable = this.ordreexercicemodifiableControl.value ? true : false;
    this.formData.global = this.globalControl.value ? true : false;

    if (this.categoriesService.listeOfSeries.length > 0) {
      const serieexercice = this.categoriesService.listeOfSeries.map((obj) => {
        return Object.assign({}, obj);
      });
      this.formData.serieexercice = serieexercice;
    }
  }

  onSubmit() {
    this.setFormDataValue();
    this.methodesService.createMethode(this.formData);
  }

  fonction(index: number) {
    this.categoriesService.setIndexValue(index);
    this.openMatDialog();
  }

  onDeleteCategorie(cat: Categorie, index: number) {
    const position = this.categoriesService.listeOfSeries[index].categories.findIndex(it => it.id === cat.id);
    if (position >= 0) {
      this.categoriesService.listeOfSeries[index].categories.splice(position, 1);
    }
  }

  openMatDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.matDialog.open(CategoriesComponent, dialogConfig);
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
  }

}
