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
import { Bloc } from '../bloc';
import { PathologieAvance } from 'src/app/exercices-series/pathologie-avance';
import { CategorieAvance } from '../categorie-avance';
import { ExerciceSerieAvance } from '../exercice-serie-avance';

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
  semaineNiveauSelected: number[] = [];
  nombreSeance: number;
  pathologies: Pathologie[];
  echauffSerieFixe: ExerciceSerie[];
  toAddSemaineNiveau: boolean;

  // for blocs
  listeDuree = new Listes().dureemethodes;
  tableFormControl: any[] = [];

  constructor(private programmesService: ProgrammesService,
              private route: ActivatedRoute,
              private niveauxService: NiveauxService,
              private objectifsService: ObjectifsService,
              private pathologiesService: PathologiesService,
              private exercicesSeriesService: ExercicesSeriesService) { }

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
        this.seancesOfProgramme.forEach((it, index) => {
          it.toAddPathologie = false;
          it.blocs.forEach(bl => {
            this.tableFormControl.push(new FormControl());
          });
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
    const index = this.semaineNiveauSelected.findIndex(it => it === item);
    if (index < 0 ) {
      this.semaineNiveauSelected.push(item);
    }

    this.updateField('semaineduniveau', this.semaineNiveauSelected);
  }

  deleteSemaineNiveau() {

  }



  // SECTION DE GESTION DES SEANCES

  addPathologie(item: Pathologie, index: number) {
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
/*
    const catexe  = this.seancesOfProgramme[index].categoriesexercices.map((obj) => {
      return Object.assign({}, obj);
    });
    this.seancesOfProgramme[index].categoriesexercices = catexe;

    const pathol  = this.seancesOfProgramme[index].pathologies.map((obj) => {
      return Object.assign({}, obj);
    });
    this.seancesOfProgramme[index].pathologies = pathol;

    const bl  = this.seancesOfProgramme[index].blocs.map((obj) => {
      return Object.assign({}, obj);
      });
    this.seancesOfProgramme[index].blocs = bl;
 */
    this.updateField('seances', this.seancesOfProgramme);
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
/*
    const pathol  = this.seancesOfProgramme[index].pathologies.map((obj) => {
      return Object.assign({}, obj);
    });
    this.seancesOfProgramme[index].pathologies = pathol;

    const bl  = this.seancesOfProgramme[index].blocs.map((obj) => {
      return Object.assign({}, obj);
      });
    this.seancesOfProgramme[index].blocs = bl;
 */
    this.updateField('seances', this.seancesOfProgramme);
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

   this.tableFormControl.push(new FormControl());
   this.seancesOfProgramme[seance].blocs.push(new Bloc());

   this.formatClass(seance);

   this.updateField('seances', this.seancesOfProgramme);
  }

  updateBlocField(seance: number, bloc: number, attribut: string) {



    console.log(this.seancesOfProgramme);
  }

}
