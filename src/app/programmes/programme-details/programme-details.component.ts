import { MatDialog } from '@angular/material';
import { Listes } from 'src/app/shared/listes';
import { Pathologie } from './../../shared/pathologies/pathologie';
import { Component, OnInit } from '@angular/core';
import { ProgrammesService } from '../programmes.service';
import { ActivatedRoute } from '@angular/router';
import { Programme } from '../programme';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { FormControl } from '@angular/forms';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { PathologiesService } from 'src/app/shared/pathologies/pathologies.service';
import { Seance } from '../seance';
import { ExerciceSerie } from 'src/app/exercices-series/exercice-serie';
import { ExercicesSeriesService } from 'src/app/exercices-series/exercices-series.service';
import { PathologieAvance } from 'src/app/exercices-series/pathologie-avance';
import { CategorieAvance } from '../categorie-avance';
import { ExerciceSerieAvance } from '../exercice-serie-avance';
import { BlocDetailsComponent } from './bloc-details/bloc-details.component';

@Component({
  selector: 'app-programme-details',
  templateUrl: './programme-details.component.html',
  styleUrls: ['./programme-details.component.css']
})
export class ProgrammeDetailsComponent implements OnInit {

  formData: Programme;
  niveaux: Niveau[];
  toChangeNiveau: boolean;
  extraControl = new FormControl();
  custompointsfaiblesControl = new FormControl();
  showCustompointsfaibles: boolean;

  objectifsSelected: Objectif[];
  objectifsNotSelected: Objectif[] = [];
  objectifs: Objectif[];


  // for seances
  seancesOfProgramme: Seance[] = [];
  allListeSemaineNiveau = new Listes().semaineduniveau;
  listeFrequence = new Listes().frequence;
  semaineNiveauSelected: number[] = [];
  nombreSeance: number;
  pathologies: Pathologie[];
  echauffSerieFixe: ExerciceSerie[];
  toAddSemaineNiveau: boolean;

  constructor(private programmesService: ProgrammesService,
              private route: ActivatedRoute,
              private niveauxService: NiveauxService,
              private objectifsService: ObjectifsService,
              private pathologiesService: PathologiesService,
              private exercicesSeriesService: ExercicesSeriesService,
              public dialog: MatDialog) { }

  ngOnInit() {

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    this.pathologiesService.getAllPathologies();
    this.pathologiesService.pathologieSubject.subscribe(data => {
      this.pathologies = data;
    });

    this.exercicesSeriesService.getAllSeriesExercicesByType('echauffement');
    this.exercicesSeriesService.serieExerciceFixeByTypeSubject.subscribe(data => {
      this.echauffSerieFixe = data;
    });

    const id = this.route.snapshot.params.id;
    this.programmesService.getSingleProgramme(id).then((item: Programme) => {
      this.formData = item;
      this.extraControl.setValue(item.extra);
      this.custompointsfaiblesControl.setValue(item.custompointsfaibles);
      this.objectifsSelected = item.objectifs;

      if (item.niveau != null) {
        if (item.niveau.nombre > 1) {
          this.showCustompointsfaibles = true;
        } else {
          this.showCustompointsfaibles = false;
        }
      }

      if (item.semaineduniveau) {
        this.semaineNiveauSelected = item.semaineduniveau;
      }

      if (item.seances) {
        this.seancesOfProgramme = item.seances as Seance[];
        this.seancesOfProgramme.forEach((it, seance) => {
          it.toAddPathologie = false;
          this.getCategoriesExercices(seance);
          this.formatClass(seance);
        });
      }



    }).then(() => {
      this.objectifs.forEach(item => {
        const index = this.objectifsSelected.findIndex(it => it.id === item.id);
        if (index < 0) {
          this.objectifsNotSelected.push(item);
        }
      });
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  updateField(attribut: string, value: any) {

    if (attribut === 'seances') {
      value = this.seancesOfProgramme.map((obj) => {
        return Object.assign({}, obj);
      });
    }
    this.programmesService.newUpdateVersion(this.formData, attribut, value);

    if (attribut === 'niveau') {
      if (value.nombre > 1) {
        this.showCustompointsfaibles = true;
      } else {
        this.showCustompointsfaibles = false;
      }
    }

    if (attribut === 'frequence') {
      this.seancesOfProgramme = [];
      for (let index = 0; index < value; index++) {
        this.seancesOfProgramme[index] = new Seance();
      }
    }

    if (attribut === 'extra') {
      if (this.extraControl.value) {
        this.formData.frequence = 1;
        this.seancesOfProgramme = [];
        this.seancesOfProgramme[0] = new Seance();
      }
    }
  }

  onObjectifSelected(event, item: Objectif) {
    if (event.checked) {
      this.objectifsSelected.push(item);
      const index = this.objectifsNotSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsNotSelected.splice(index, 1);
      }
    } else {
      this.objectifsNotSelected.push(item);
      const index = this.objectifsSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsSelected.splice(index, 1);
      }
    }
    this.updateField('objectifs', this.objectifsSelected);
  }

  addSemaineNiveau(item: number) {

    if (this.formData.nbrsemaine > this.semaineNiveauSelected.length) {
      const index = this.semaineNiveauSelected.findIndex(it => it === item);
      if (index < 0 ) {
        this.semaineNiveauSelected.push(item);
      }

      this.updateField('semaineduniveau', this.semaineNiveauSelected);
    } else {
      alert('nombre de semaine niveau atteint');
    }

  }

  deleteSemaineNiveau(index: number) {
    this.semaineNiveauSelected.splice(index, 1);
    this.updateField('semaineduniveau', this.semaineNiveauSelected);
  }



  // SECTION DE GESTION DES SEANCES

  addPathologie(item: Pathologie, index: number) {

    const position = this.seancesOfProgramme[index].pathologies.findIndex(it => it.id === item.id);

    if (position < 0) {
      const local = new PathologieAvance();
      local.id = item.id;
      local.nom = item.nom;
      local.acronyme = item.acronyme;
      this.seancesOfProgramme[index].pathologies.push(local);

      if (item.exercicesCategorie) {
          item.exercicesCategorie.forEach(it => {
          const i =  this.seancesOfProgramme[index].categoriesexercices
                                          .findIndex(execat => execat.id === it.id);
          if (i < 0) {
            const localCat = new CategorieAvance();
            localCat.id = it.id;
            localCat.nom = it.nom;
            localCat.acronyme = it.acronyme;
            localCat.duree = it.duree;
            this.seancesOfProgramme[index].categoriesexercices.push(localCat);
          }
          });
      }
      this.formatClass(index);
      this.updateField('seances', this.seancesOfProgramme);
    }
  }


  removePathologie(index: number, index2: number) {

    this.seancesOfProgramme[index].pathologies.splice(index2, 1);

    const taille = this.seancesOfProgramme[index].categoriesexercices.length;
    this.seancesOfProgramme[index].categoriesexercices.splice(0, taille);

    this.seancesOfProgramme[index].pathologies.forEach(it => {

      this.pathologiesService.getSinglePathologie(it.id).then(currentPatho => {
        if (currentPatho.exercicesCategorie) {

            currentPatho.exercicesCategorie.forEach(itt => {
              const i =  this.seancesOfProgramme[index].categoriesexercices
              .findIndex(execat => execat.id === itt.id);
              if (i < 0) {
                  const localCat = new CategorieAvance();
                  localCat.id = itt.id;
                  localCat.nom = itt.nom;
                  localCat.acronyme = itt.acronyme;
                  localCat.duree = itt.duree;
                  this.seancesOfProgramme[index].categoriesexercices.push(Object.assign({}, localCat));
                }
              });
        }
      });
    });
    this.formatClass(index);
    this.updateField('seances', this.seancesOfProgramme);
  }

  getCategoriesExercices(index: number) {
    this.seancesOfProgramme[index].pathologies.forEach(it => {

      this.pathologiesService.getSinglePathologie(it.id).then(currentPatho => {
        if (currentPatho.exercicesCategorie) {

            currentPatho.exercicesCategorie.forEach(itt => {
              const i =  this.seancesOfProgramme[index].categoriesexercices
              .findIndex(execat => execat.id === itt.id);
              if (i < 0) {
                  const localCat = new CategorieAvance();
                  localCat.id = itt.id;
                  localCat.nom = itt.nom;
                  localCat.acronyme = itt.acronyme;
                  localCat.duree = itt.duree;
                  this.seancesOfProgramme[index].categoriesexercices.push(Object.assign({}, localCat));
                }
              });
        }
      });
    });
  }

  addEchauffement(seance: number, serie: ExerciceSerie) {
    const local = new ExerciceSerieAvance();
    local.id = serie.id;
    local.senior = serie.senior;
    local.nom = serie.nom;

    const echauff = Object.assign({}, local);
    this.seancesOfProgramme[seance].echauffement = echauff;

    this.updateField('seances', this.seancesOfProgramme);
  }

  deleteSeance(seance: number) {
    if (confirm('Confirmation de la suppression')) {
      this.seancesOfProgramme.splice(seance, 1);
      if (this.seancesOfProgramme.length !== 0) {
        this.formatClass(seance);
      }
      this.updateField('seances', this.seancesOfProgramme);
    }
  }

  formatClass(seance: number) {
     const execat  = this.seancesOfProgramme[seance].categoriesexercices.map((obj) => {
      return Object.assign({}, obj);
      });
     this.seancesOfProgramme[seance].categoriesexercices = execat;

     const pathol  = this.seancesOfProgramme[seance].pathologies.map((obj) => {
      return Object.assign({}, obj);
    });
     this.seancesOfProgramme[seance].pathologies = pathol;

     const bl  = this.seancesOfProgramme[seance].blocs.map((obj) => {
      return Object.assign({}, obj);
      });
     this.seancesOfProgramme[seance].blocs = bl;
  }

  // SECTION DE GESTION DES BLOCS DE SEANCES
  addBloc(seance: number) {
    const dialogRef = this.dialog.open(BlocDetailsComponent, {
      width: '95%',
      data: {niveau: this.formData.niveau}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.seancesOfProgramme[seance].blocs.push(result);
        this.formatClass(seance);
        this.updateField('seances', this.seancesOfProgramme);
      }
    });
  }

  editBloc(seance: number, bloc: number) {
    const dialogRef = this.dialog.open(BlocDetailsComponent, {
      width: '95%',
      data: {niveau: this.formData.niveau, currentBloc: this.seancesOfProgramme[seance].blocs[bloc]}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.seancesOfProgramme[seance].blocs[bloc] = result;
        this.formatClass(seance);
        this.updateField('seances', this.seancesOfProgramme);
      }
    });
  }

  deleteBloc(seance: number, bloc: number) {
    if (confirm('Confirmation de suppression ?')) {
      this.seancesOfProgramme[seance].blocs.splice(bloc, 1);
      this.formatClass(seance);
      this.updateField('seances', this.seancesOfProgramme);
    }
  }


}
