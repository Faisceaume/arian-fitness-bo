import { Bloc } from './../bloc';
import { MethodesService } from './../../methodes/methodes.service';
import { MatDialog } from '@angular/material';
import { Listes } from 'src/app/shared/listes';
import { Component, OnInit } from '@angular/core';
import { ProgrammesService } from '../programmes.service';
import { ActivatedRoute } from '@angular/router';
import { Programme } from '../programme';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { FormControl } from '@angular/forms';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { Seance } from '../seance';
import { BlocDetailsComponent } from './bloc-details/bloc-details.component';
import { Methode } from 'src/app/methodes/methode';

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
  showObjectif: boolean;
  showNombreSemaine = true;

  objectifsSelected: Objectif[];
  objectifsNotSelected: Objectif[] = [];
  objectifs: Objectif[];


  // for seances
  seancesOfProgramme: Seance[] = [];
  allListeSemaineNiveau = new Listes().semaineduniveau;
  listeFrequence = new Listes().frequence;
  nombreSemaine = new Listes().nombresemaine;
  semaineNiveauSelected: number[] = [];
  nombreSeance: number;

  toAddSemaineNiveau: boolean;
  listeNiveau: Niveau[];

  constructor(private programmesService: ProgrammesService,
              private route: ActivatedRoute,
              private niveauxService: NiveauxService,
              private objectifsService: ObjectifsService,
              private methodesService: MethodesService,
              public dialog: MatDialog) { }

  ngOnInit() {

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
      this.initSearchProg();
    });

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

  }


  initSearchProg() {
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

        if (item.niveau.nombre === 0) {
          this.showNombreSemaine = false;
        } else {
          this.showNombreSemaine = true;
        }

        const position = this.niveaux.findIndex(it => it.id === item.niveau.id);
        this.listeNiveau = [];
        for (let index = 0; index <= position; index++) {
          this.listeNiveau.push(this.niveaux[index]);
        }
      }

      if (item.semaineduniveau) {
        this.semaineNiveauSelected = item.semaineduniveau;
      }

      if (item.seances) {
        this.seancesOfProgramme = item.seances as Seance[];
        this.seancesOfProgramme.forEach((it, seance) => {
          this.formatClass(seance);
        });

        if (!item.fusion) {
          // this.fusion();
          this.function1();
        }
      }

    }).then(() => {
      this.objectifs.forEach(item => {
        const index = this.objectifsSelected.findIndex(it => it.id === item.id);
        if (index < 0) {
          this.objectifsNotSelected.push(item);
        }
      })
    })
  }


  updateField(attribut: string, value: any) {

    if (attribut === 'seances') {
      value = this.seancesOfProgramme.map((obj) => {
        return Object.assign({}, obj);
      });
    }
    this.programmesService.newUpdateVersion(this.formData, attribut, value);

    if (attribut === 'niveau') {
      if (value.nombre > 2) {
        this.showCustompointsfaibles = true;
      } else {
        this.showCustompointsfaibles = false;
      }

      if (value.nombre === 0) {
        this.showNombreSemaine = false;
        this.programmesService.newUpdateVersion(this.formData, 'nbrsemaine', 0);
        this.formData.nbrsemaine = 0;
      } else {
        this.showNombreSemaine = true;
      }

      const position = this.niveaux.findIndex(it => it.id === value.id);
      this.listeNiveau = [];
      for (let index = 0; index <= position; index++) {
        this.listeNiveau.push(this.niveaux[index]);
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
      alert('Le nombre de semaine précisé est atteint');
    }

  }

  deleteSemaineNiveau(index: number) {
    this.semaineNiveauSelected.splice(index, 1);
    this.updateField('semaineduniveau', this.semaineNiveauSelected);
  }

  // SECTION DE GESTION DES SEANCES

  deleteSeance(seance: number) {
    if (confirm('Confirmation de la suppression')) {
      this.seancesOfProgramme.splice(seance, 1);
      if (this.seancesOfProgramme.length !== 0 && this.seancesOfProgramme[seance] !== undefined) {
        this.formatClass(seance);
      }
      this.updateField('seances', this.seancesOfProgramme);
    }
  }

  formatClass(seance: number) {
     const bl  = this.seancesOfProgramme[seance].blocs.map((obj) => {
      return Object.assign({}, obj);
      });
     this.seancesOfProgramme[seance].blocs = bl;
  }

  // SECTION DE GESTION DES BLOCS DE SEANCES
  addBloc(seance: number) {

    if (this.formData.niveau) {

      const dialogRef = this.dialog.open(BlocDetailsComponent, {
        width: '95%',
        data: {niveau: this.listeNiveau, extra: this.extraControl.value}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.seancesOfProgramme[seance].blocs.push(result);
          this.formatClass(seance);
          this.updateField('seances', this.seancesOfProgramme);
          this.function1();
        }
      });

    } else {
      alert('Aucun niveau n\'est sélectionné sur le programme');
    }
  }

  editBloc(seance: number, bloc: number) {
    const dialogRef = this.dialog.open(BlocDetailsComponent, {
      width: '95%',
      data: {niveau: this.listeNiveau, currentBloc: this.seancesOfProgramme[seance].blocs[bloc], extra: this.extraControl.value }
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


  // ZONE DE FUSION DES BLOCS DE SEANCES

  deleteMethode15(seance: number, bloc: number, methode: number) {
    this.seancesOfProgramme[seance].blocs[bloc].quartfusion.splice(methode, 1);
    this.updateField('seances', this.seancesOfProgramme);
  }

  deleteMethode30(seance: number, bloc: number, methode: number) {
    this.seancesOfProgramme[seance].blocs[bloc].demifusion.splice(methode, 1);
    this.updateField('seances', this.seancesOfProgramme);
  }

  resetFusion() {
    this.formData.fusion = false;
    this.updateField('fusion', false);
    this.function1();
  }

  saveFusion() {
    this.programmesService.newUpdateVersion(this.formData, 'fusion', true);
    this.programmesService.newUpdateVersion(this.formData, 'seances', this.seancesOfProgramme);
    this.formData.fusion = true;
  }

  // Parcours les séances et les blocs et identifie les blocs fusionnables
  function1() {
    for (const [indexSeance, seance] of this.seancesOfProgramme.entries()) {
      for (const [indexBloc, bloc] of seance.blocs.entries()) {
        if (bloc.fusionnable) {
           this.function2(indexSeance, indexBloc);
        }
      }
    }
  }

  // Récupère les blocs suivants un bloc fusionnable
  // et stoque dans un tableau les blocs d'après en s'arrêtant au bloc qui n'est pas fusionnable
  function2(seance: number, positionBloc: number) {
    const data = [];
    for (let index = positionBloc; index < this.seancesOfProgramme[seance].blocs.length; index++) {
      if (this.seancesOfProgramme[seance].blocs[index].fusionnable) {
        data.push(this.seancesOfProgramme[seance].blocs[index]);
      } else {
        data.push(this.seancesOfProgramme[seance].blocs[index]);
        break;
      }
    }
    this.function3(data, seance, positionBloc);
  }

  // exécutée sur un bloc avec sa position dans la séance et un tableau (data) des blocs suivants
  // calcul la durée additionnée des blocs et récupère les méthodes coorespondantes
  function3(data: any, seance: number, positionBloc: number) {
    let min = 0;
    let sec = 0;

    for (const bloc of data) {
      let dureeFinale = '';
      // opérations sur la durée
      const donnees = bloc.duree.split(' ');
      // tslint:disable-next-line: radix
      min += parseInt(donnees[0]);
      if (donnees[2]) {
        // tslint:disable-next-line: radix
        sec += parseInt(donnees[2]);
        if (sec === 60) {
          min += 1;
          sec = 0;
        }
      }
      sec > 0 ? dureeFinale = min + ' minutes ' + sec :
                    dureeFinale = min + ' minutes ';

      // recherche des methodes compatibles et attribution au bloc parent
      const liste1 = [];
      this.listeNiveau.forEach((niv: Niveau) => {
          this.methodesService.getMethodesForProgramme(niv, data[0].orientation, dureeFinale.trim())
            .then((dat: Methode[]) => {
              dat.forEach((it: Methode) => {
              const position = liste1.findIndex(itt => itt.id === it.id);
              if (position < 0) {
                liste1.push(it);
              }
            });
          });

        });
      if (dureeFinale.trim() === '15 minutes') {
        this.seancesOfProgramme[seance].blocs[positionBloc].quartfusion = liste1;
       } else if (dureeFinale.trim() === '30 minutes') {
        this.seancesOfProgramme[seance].blocs[positionBloc].demifusion = liste1;
       }
    }
  }


}
