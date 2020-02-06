import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices.service';
import { Exercice } from '../exercice';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { Materiel } from 'src/app/materiels/materiel';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MaterielsSharedComponent } from 'src/app/shared/materiels-shared/materiels-shared.component';
import { Listes } from 'src/app/shared/listes';
import { CanActivate, ActivatedRoute } from '@angular/router';

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
  repetitionexercice = new FormControl();
  visibility = new FormControl();
  showSeniotRepetList = false;
  listes: Listes;
  regimeSelected: string[]  = [];

  constructor(private exercicesService: ExercicesService,
              private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private categoriesService: CategoriesService,
              public materielsService: MaterielsService,
              private route: ActivatedRoute,
              private matDialog: MatDialog) { }

  ngOnInit() {

    this.listes = new Listes();

    this.firstFormGroup = this.formBuilder.group({
        age: ['SUP19'],
        consignecourte: [''],
        consignelongue: ['', Validators.required],
        genre: ['H&F', Validators.required],
        niveau: [null, Validators.required],
        numero: [null, Validators.required],
        nom: ['', Validators.required],
        pathologie: ['sans'],
        position: ['debout'],
        regime: [],
        senior: ['non'],
        type: ['global', Validators.required],
      });

    this.secondFormGroup = this.formBuilder.group({
        accessalledesport: [false],
        visibility: [false],
        degressif: [false],
        visuel: [false],
        echauffement: [false],
        nbrerepetitionechauffement: [0],
        nbrrepetitionsenior: [0],
        nbrerepetitionexercice: [this.listes.nbrerepetexercice[1]],
        repetitionexercice: [false, Validators.required],
        nbrerepetretourcalme: ['2 minutes', Validators.required],
        retouraucalme: [false, Validators.required],
      });

    this.thirdFormGroup = this.formBuilder.group({
        });

    this.firstFormGroup.get('niveau').valueChanges.subscribe(item => {
        this.showSeniotRepetList = item.acronyme === 'S80+' ? true : false;
      });

    this.materielsService.resetMaterielSelected();
    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });

  }

  setFormDataValue() {
    this.formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    } as Exercice;

    this.formData.regime = this.regimeSelected;

    if (this.echauffementControl.value) {
      this.formData.echauffement = this.echauffementControl.value;
    }
    if (this.accessalledesportControl.value) {
      this.formData.accessalledesport = this.accessalledesportControl.value;
    }

    if (this.visibility.value) {
      this.formData.visibility = this.visibility.value;
    }

    if (this.degressif.value) {
      this.formData.degressif = this.degressif.value;
    }

    if (this.visuel.value) {
      this.formData.visuel = this.visuel.value;
    }

    if (this.retouraucalme.value) {
      this.formData.retouraucalme = this.retouraucalme.value;
    }

    if (this.repetitionexercice.value) {
      this.formData.repetitionexercice = this.repetitionexercice.value;
    }
  }

  onSubmit(): void {
    this.setFormDataValue();
    this.formData.categories = this.categoriesService.chipsSelectedForOperation;
    this.formData.materiels = this.materielsService.materielsSelected;

    this.categoriesService.setChipsSelectedForOperationValue(null);
    this.exercicesService.createExercice(this.formData);
  }

  removeMateriel(materiel: Materiel): void {
    const list = this.materielsService.materielsSelected;
    const index = list.findIndex(item => item.id === materiel.id);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.matDialog.open(MaterielsSharedComponent, dialogConfig);
  }

  onRegimeSelected(event, item: string) {
    if (event.checked) {
      this.regimeSelected.push(item);
    } else {
      const index = this.regimeSelected.indexOf(item);
      if (index >= 0 ) {
        this.regimeSelected.splice(index, 1);
      }
    }
  }

}
