import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { Listes } from 'src/app/shared/listes';
import { Methode } from '../methode';
import { MethodesService } from '../methodes.service';
import { CategoriesService } from 'src/app/shared/categories/categories.service';

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

  // pour les séries d'exercice
  nbrdeserie: number;

  constructor(private formBuilder: FormBuilder,
              private methodesService: MethodesService,
              public categoriesService: CategoriesService) { }

  ngOnInit() {

    this.listes = new Listes();

    this.firstFormGroup = this.formBuilder.group({
      nom: ['', Validators.required],
      acronyme: ['', Validators.required],
      duree: ['']
    });

    this.secondFormGroup = this.formBuilder.group({
      consigne: ['', Validators.required],
      orientation: ['renforcement', Validators.required],
      niveau: [null, Validators.required],
      senior : ['avec', Validators.required],
      nbrexparserie: [null, Validators.required],
      nbrexercicesminimum: [null, Validators.required],
      nbrseries: [null, Validators.required],
    });

    this.categoriesService.listeOfSeries = [];
  }

  setFormDataValue() {
    this.formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
    } as Methode;

    this.formData.global = this.globalControl.value ? true : false;

  }

  onSubmit() {
    this.setFormDataValue();
    this.methodesService.createMethode(this.formData);
  }

}
