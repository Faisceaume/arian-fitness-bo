import { Component, OnInit } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit {

  isLinear = false;
  formData: Exercice;
  niveaux: Niveau[];
  toChangeNiveau: boolean;
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private niveauxService: NiveauxService) {
  }

  ngOnInit() {

    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then((item: Exercice) => {
      this.formData = item;
      this.echauffementControl.setValue(item.echauffement);
      this.accessalledesportControl.setValue(item.accessalledesport);
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
    this.niveaux = data;
  });
  }

  updateFiel(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
  }

}
