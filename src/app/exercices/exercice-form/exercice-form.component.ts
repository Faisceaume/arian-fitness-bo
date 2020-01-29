import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices.service';
import { Exercice } from '../exercice';
import { FormControl } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { Materiel } from 'src/app/materiels/materiel';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MaterielsSharedComponent } from 'src/app/shared/materiels-shared/materiels-shared.component';

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrls: ['./exercice-form.component.css']
})
export class ExerciceFormComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  formData: Exercice;
  niveaux: Niveau[];
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();
  degressif = new FormControl();
  visuel = new FormControl();
  retouraucalme = new FormControl();
  repetitionsexercice = new FormControl();
  showSeniotRepetList = false;

  ages = [
    'à partir de 20 ans',
    'age maximal 49 ans',
  ];


  nbrerepetechauffement = [
    '5',
    '10',
    '15',
    '20',
    '15 secondes',
    '10 secondes'
  ];

  nbrerepetretourcalme = [
    '2 minutes',
    '15 secondes',
    '3 répétitions'
  ];

  nbrerepetsenior = [
    '15 à 20 répétitions',
    '10 à 15 répétitions',
    '6 à 15 par côté',
    '10 répétions',
    '10 répétions par côté',
    '10 à 20 répétions',
    '15 secondes par côté',
    '20 secondes',
    '30 secondes',
    '30 secondes par côté',
    '45 secondes'
  ];

  nbrerepetexercice = [
    '5 à 12 répétitions',
    '5 à 12 répétitions par côté',
    '6 à 15 répétitions par côté',
    '8 à 15 répétitions',
    '8 à 15 répétitions par côté',
    '10 à 15 répétitions',
    '10 répétitions',
    '10 répétitions par côté',
    '10 à 20 répétitions',
    '15 à 20 répétitions',
    '15 secondes par côté',
    '20 secondes',
    '30 secondes par côté',
    '30 secondes',
    '30 secondes',
    '30 secondes par côté',
    '45 secondes',
    'Maximum de répétitions',
    'Maximum de temps'
  ];



  constructor(private exercicesService: ExercicesService,
              private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private categoriesService: CategoriesService,
              public materielsService: MaterielsService,
              private matDialog: MatDialog) { }

  ngOnInit() {

    this.firstFormGroup = this.formBuilder.group({
      numero: [0, Validators.required],
      nom: ['', Validators.required],
      type: ['global', Validators.required],
      descriptif: ['', Validators.required],
      niveaumax: [null, Validators.required],
      duree: [0, Validators.required],
      position: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      ageminimal: [0, Validators.required],
      agemaximal: [0, Validators.required],
      echauffement: [false, Validators.required],
      nbrerepetitionechauffement: [0, Validators.required],
      nbrrepetitionsenior: [0, Validators.required],
      nbrerepetitionexercice: [0, Validators.required],
      accessalledesport: [false, Validators.required],
      degressif: [false, Validators.required],
      repetitionsexercice: [false, Validators.required],
      retouraucalme: [false, Validators.required],
      visuel: [false, Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({
      regime: ['', Validators.required],
      consigne: ['', Validators.required],
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });

    this.firstFormGroup.get('niveaumax').valueChanges.subscribe(item => {
      this.showSeniotRepetList = item.acronyme === 'S80+' ? true : false;
    });
  }

  setFormDataValue() {
    this.formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    } as Exercice;

    if (this.echauffementControl.value) {
      this.formData.echauffement = this.echauffementControl.value;
    }
    if (this.accessalledesportControl.value) {
      this.formData.accessalledesport = this.accessalledesportControl.value;
    }
  }

  onSubmit(): void {
    this.setFormDataValue();
    this.formData.categories = this.categoriesService.chipsSelectedForOperation;
    this.formData.materiels = this.materielsService.materielsSelected;
    this.categoriesService.setChipsSelectedForOperationValue(null);
    this.exercicesService.createExercice(this.formData);
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.matDialog.open(MaterielsSharedComponent, dialogConfig);
  }

}
