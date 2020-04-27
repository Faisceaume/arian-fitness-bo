import { ExerciceSerie } from './../exercice-serie';
import { Listes } from './../../shared/listes';
import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { Component, OnInit } from '@angular/core';
import { Pathologie } from 'src/app/shared/pathologies/pathologie';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { Exercice } from 'src/app/exercices/exercice';
import { ExerciceAvance } from 'src/app/exercices-series/exercice-avance';
import { ExercicesSeriesService } from '../exercices-series.service';
import { ActivatedRoute } from '@angular/router';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PathologieAvance } from '../pathologie-avance';

@Component({
  selector: 'app-serie-details',
  templateUrl: './serie-details.component.html',
  styleUrls: ['./serie-details.component.css']
})
export class SerieDetailsComponent implements OnInit {

  exercicesAvances: ExerciceAvance[] = [];
  pathologies: Pathologie[];
  exercices: Exercice[] = [];
  formData: ExerciceSerie;

  nbreReptEchauff = new Listes().nbrerepetechauffement;
  nbreRetourCalme = new Listes().nbrerepetretourcalme;
  nbreReptSenior = new Listes().nbrerepetsenior;
  nbreReptExercices = new Listes().nbrerepetexercice;
  nbreTempsDeRepos = new Listes().nbrreposexercice;
  nbreSerie = new Listes().listeNbrexparserie;

  toAddPathologie: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<Exercice[]>;

  pathologiesSelected: PathologieAvance[];
  pathologiesNotSelected: Pathologie[];

  constructor(private pathologiesService: PathologiesService,
              private exercicesService: ExercicesService,
              private exercicesSeriesService: ExercicesSeriesService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    const id = this.route.snapshot.params.id;
    this.exercicesSeriesService.getSingleExerciceSerie(id).then((item: ExerciceSerie) => {
      this.formData = item;
      this.exercicesAvances = item.exercices;
      this.pathologiesSelected = item.pathologies;
    }).then(() => {
      this.pathologiesService.getAllPathologies();
      this.pathologiesService.pathologieSubject.subscribe(data => {
      this.pathologies = data;
      this.pathologiesSelectedChange();
    });
    });

    this.exercicesService.getAllExercices();
    this.exercicesService.exerciceSubject.subscribe(data => {
      this.exercices = data;
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nom),
        map(nom => nom ? this._filter(nom) : this.exercices.slice())
      );
  }

  updateField(attribut: string, value: any) {
    if (attribut === 'exercices') {
      value = value.map((obj) => {
        return Object.assign({}, obj);
      });
    }
    this.exercicesSeriesService.newUpdateVersion(this.formData, attribut, value);
  }


  // OPERATIONS SUR LES EXERCICES

  addExercice(exercice: Exercice) {
    const local = new ExerciceAvance();
    local.exercice = exercice.id;
    local.nomexercice = exercice.nom;
    local.visibilityexercice = exercice.visibility;
    local.nbrederepetition = '';
    local.nbredeserie = '';
    local.tempsderepos = '';
    this.exercicesAvances.push(local);

    const field = this.exercicesAvances.map((obj) => {
      return Object.assign({}, obj);
    });
    this.updateField('exercices', field);
    this.myControl.setValue('');
    this.exercicesSeriesService.addSerieFixeOnExercice(exercice, this.formData);
  }

  deleteExercice(index: number, exercice: string) {
    this.exercicesAvances.splice(index, 1);
    const field = this.exercicesAvances.map((obj) => {
      return Object.assign({}, obj);
    });
    this.updateField('exercices', field);
    this.exercicesSeriesService.deleteSerieFixeOnExercice(exercice, this.formData);
  }

  displayFn(exercice?: Exercice): string | undefined {
    return exercice ? exercice.nom : undefined;
  }

  private _filter(nom: string): Exercice[] {
    const filterValue = nom.toLowerCase();
    return this.exercices.filter(option => option.nom.toLowerCase().indexOf(filterValue) === 0);
  }


  // OPERATIONS SUR LES PATHOLOGIES

  afficher(item: Pathologie) {
    const local = new PathologieAvance();
    local.id = item.id;
    local.acronyme = item.acronyme;
    local.nom = item.nom;
    this.pathologiesSelected.push(local);
    const value = this.pathologiesSelected.map((obj) => {
      return Object.assign({}, obj);
    });
    this.updateField('pathologies', value);
    this.pathologiesSelectedChange();
  }

  removePathologie(id: number) {
    this.pathologiesSelected.splice(id, 1);
    const value = this.pathologiesSelected.map((obj) => {
      return Object.assign({}, obj);
    });
    this.updateField('pathologies', value);
    this.pathologiesSelectedChange();
  }

  pathologiesSelectedChange() {
    this.pathologiesNotSelected = this.pathologies.filter( item =>
      this.pathologiesSelected.findIndex(it => it.id === item.id) < 0);
  }
}
