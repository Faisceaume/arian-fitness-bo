import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { Listes } from 'src/app/shared/listes';
import { Methode } from '../methode';
import { MethodesService } from '../methodes.service';

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
  niveaux: Niveau[];
  listes: Listes;

  constructor(private formBuilder: FormBuilder,
              private niveauxService: NiveauxService,
              private methodesService: MethodesService) { }

  ngOnInit() {
    this.listes = new Listes();
    this.firstFormGroup = this.formBuilder.group({
      nom: ['', Validators.required],
      acronyme: ['', Validators.required],
      nbrseries: ['', Validators.required],
      dureeminimum: ['', Validators.required],
      consigne: ['', Validators.required],
      orientation: ['renforcement', Validators.required],
      niveau: ['', Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      nbrexparserie: ['', Validators.required],
      nbrexercicesminimum: ['', Validators.required],
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
    } as Methode;

    if (this.seniorControl.value) {
      this.formData.senior = this.seniorControl.value;
    }

    if (this.ordreexercicemodifiableControl.value) {
      this.formData.ordreexercicemodifiable = this.ordreexercicemodifiableControl.value;
    }

    if (this.globalControl.value) {
      this.formData.global = this.globalControl.value;
    }
  }

  onSubmit() {
    this.setFormDataValue();
    this.methodesService.createMethode(this.formData);
  }

}
