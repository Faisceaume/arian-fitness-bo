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
  seniorControl = new FormControl();
  ordreexercicemodifiableControl = new FormControl();
  globalControl = new FormControl();
  customControl = new FormControl();
  niveaux: Niveau[];
  listes: Listes;

  // pour les séries d'exercice
  nbrdeserie: number;
  // listeDesSeries: Series[] = [];

  constructor(private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private methodesService: MethodesService,
              public categoriesService: CategoriesService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.listes = new Listes();
    this.firstFormGroup = this.formBuilder.group({
      nom: ['', Validators.required],
      acronyme: ['', Validators.required],
      dureeminimum: ['', Validators.required],
      consigne: ['', Validators.required],
      orientation: ['renforcement', Validators.required],
      niveau: ['', Validators.required],
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

    this.formData.senior = this.seniorControl.value ? true : false;
    this.formData.ordreexercicemodifiable = this.ordreexercicemodifiableControl.value ? true : false;
    this.formData.global = this.globalControl.value ? true : false;
    this.formData.custom = this.customControl.value ? true : false;

    if (this.customControl.value) {
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

}
