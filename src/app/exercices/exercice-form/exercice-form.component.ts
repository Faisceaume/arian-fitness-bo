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
  materiels: Materiel[];
  materielsChecked: Materiel[] = [];
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();
  degressif = new FormControl();
  visuel = new FormControl();
  retouraucalme = new FormControl();
  repetitionsexercice = new FormControl();
  showSeniotRepetList = false;

  ages = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
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
              private materielsService: MaterielsService) { }

  ngOnInit() {

    this.materielsService.getAllMateriels();
    this.materielsService.materielSubject.subscribe(data => {
      this.materiels = data;
    });

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
    this.formData.materiels = this.materielsChecked;
    this.categoriesService.setChipsSelectedForOperationValue(null);
    this.exercicesService.createExercice(this.formData);
  }

  onCkecked(event, item: Materiel) {
    if (event.checked) {
      this.materielsChecked.push(item);
    } else {
      const id = this.materielsChecked.indexOf(item);
      if (id >= 0 ) {
        this.materielsChecked.splice(id, 1);
      }
    }
  }

}
