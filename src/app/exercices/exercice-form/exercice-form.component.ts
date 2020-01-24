import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices.service';
import { Exercice } from '../exercice';
import { FormControl } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';

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
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();

  constructor(private exercicesService: ExercicesService,
              private formBuilder: FormBuilder,
              private niveauxService: NiveauxService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      numero: [0, Validators.required],
      nom: ['', Validators.required],
      type: ['global', Validators.required],
      descriptif: ['', Validators.required],
      niveau: [null, Validators.required],
      duree: [0, Validators.required],
      position: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      ageminimal: [0, Validators.required],
      agemaximal: [0, Validators.required],
      echauffement: [false, Validators.required],
      nbrerepetitionechauffement: [0, Validators.required],
      nbrrepetitionsenior: [0, Validators.required],
      accessalledesport: [false, Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
      regime: ['', Validators.required],
      consigne: ['', Validators.required],
    });

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

    if (this.echauffementControl.value) {
      this.formData.echauffement = this.echauffementControl.value;
    }
    if (this.accessalledesportControl.value) {
      this.formData.accessalledesport = this.accessalledesportControl.value;
    }
  }

  onSubmit(): void {
    this.setFormDataValue();
    this.exercicesService.createExercice(this.formData);
  }
}
