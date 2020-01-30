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
import { Listes } from 'src/app/shared/listes';

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
  visibility = new FormControl();
  showSeniotRepetList = false;
  listes: Listes;

  constructor(private exercicesService: ExercicesService,
              private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private categoriesService: CategoriesService,
              public materielsService: MaterielsService,
              private matDialog: MatDialog) { }

  ngOnInit() {

    this.listes = new Listes();

    this.materielsService.resetMaterielSelected();

    this.firstFormGroup = this.formBuilder.group({
      numero: [null, Validators.required],
      nom: ['', Validators.required],
      type: ['global', Validators.required],
      consigne: ['', Validators.required],
      niveaumax: [null, Validators.required],
      duree: [null],
      position: ['debout'],
      regime: ['concentrique'],
      senior: ['non'],
      pathologie: ['sans'],
      age: ['SUP20']
    });

    this.secondFormGroup = this.formBuilder.group({
      accessalledesport: [false],
      visibility: [false],
      degressif: [false],
      visuel: [false],
      echauffement: [false],
      nbrerepetitionechauffement: [0],
      nbrrepetitionsenior: [0],
      nbrerepetitionexercice: [0],
      nbrrepetitionsexercice: [false, Validators.required],
      nbrerepetretourcalme: [false, Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
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
