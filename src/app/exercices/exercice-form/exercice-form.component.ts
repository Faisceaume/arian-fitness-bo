import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices.service';
import { Exercice } from '../exercice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { MaterielsService } from 'src/app/materiels/materiels.service';
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
  showSeniotRepetList = false;
  listes: Listes;
  regimeSelected: string[]  = [];

  constructor(private exercicesService: ExercicesService,
              private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              public materielsService: MaterielsService) { }

  ngOnInit() {

    this.listes = new Listes();

    this.firstFormGroup = this.formBuilder.group({
        numero: [null, Validators.required],
        nom: ['', Validators.required],
      });

    this.secondFormGroup = this.formBuilder.group({
        age: ['TOUT'],
        consignecourte: [''],
        consignelongue: ['', Validators.required],
        genre: ['H&F', Validators.required],
        niveau: [null, Validators.required],
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
        pathologie: ['sans'],
        position: ['debout'],
        regime: [],
        senior: ['non'],
        type: ['global', Validators.required]
      });

    this.thirdFormGroup = this.formBuilder.group({
        });

    this.materielsService.resetMaterielSelected();
  }

  setFormDataValue() {
    this.formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    } as Exercice;

    this.formData.regime = [];

    this.formData.echauffement = false;

    this.formData.accessalledesport = false;

    this.formData.visibility = false;

    this.formData.degressif = false;

    this.formData.visuel = false;

    this.formData.retouraucalme = false;

    this.formData.repetitionexercice = false;

    this.formData.niveau = {} as Niveau;
  }

  onSubmit(): void {
    this.setFormDataValue();
    this.formData.categories = [];
    this.formData.materiels = [];
    this.categoriesService.setChipsSelectedForOperationValue(null);
    this.exercicesService.createExercice(this.formData);
  }

}
