import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { Pathologie } from './../../shared/pathologies/pathologie';
import { ExerciceSerie } from './../../exercices-series/exercice-serie';
import { ExercicesSeriesService } from './../../exercices-series/exercices-series.service';
import { Seance } from './../../programmes/seance';
import { Programme } from './../../programmes/programme';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ProgrammesService } from 'src/app/programmes/programmes.service';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Exercice } from 'src/app/exercices/exercice';

@Component({
  selector: 'app-user-seance',
  templateUrl: './user-seance.component.html',
  styleUrls: ['./user-seance.component.css']
})
export class UserSeanceComponent implements OnInit {

  currentUser: User;
  programmes: Programme;
  seance: Seance;
  senior: string;
  echauffement: ExerciceSerie;
  pathologie: PathologieAvance;
  currentPathologie: Pathologie;
  lancementSerieFixePathos: boolean;
  isPathologie: boolean;

  niveaux: Niveau[];
  listeNiveau: Niveau[] = [];

  listeExercices: Exercice[] = [];

  constructor(private usersService: UsersService,
              private exercicesService: ExercicesService,
              private programmesService: ProgrammesService,
              private exercicesSeriesService: ExercicesSeriesService,
              private pathologiesService: PathologiesService,
              private niveauxService: NiveauxService,
              private route: ActivatedRoute) { }

  ngOnInit() {



    const id = this.route.snapshot.params.id;
    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.currentUser = item;
      this.senior = this.currentUser.senior ? 'uniquement' : 'hors';
      if (this.currentUser.pathologie) {
        this.pathologie = this.currentUser.pathologie;
        this.pathologiesService.getSinglePathologie(this.pathologie.id).then(patho => {
          this.currentPathologie = patho;
          // console.log(this.currentPathologie.exercicesCategorie);
          this.isPathologie = true;
        });
      }

    }).then(() => {
      this.programmesService
      .getProgrammeByNiveauAndFrequenceAndObjectifs(this.currentUser);
      this.programmesService.prognivsSubject.subscribe(data => {
        if (data.length !== 0) {
          this.programmes = data[0];
          this.seance = this.programmes.seances[this.currentUser.positionseance - 1];
          if (this.currentPathologie) {
            let local = [];
            this.seance.blocs.forEach(bloc => {
              local = this.currentPathologie.exercicesCategorie.filter(pa => bloc.categoriesexercices
                .findIndex(exe => exe.id === pa.id) >= 0);
              // console.log(bloc.categoriesexercices);
            });
            if (local.length > 0) {
              this.lancementSerieFixePathos = true;
            }
          }
        }
      });

      this.niveauxService.getAllNiveaux();
      this.niveauxService.niveauxSubject.subscribe(data => {
        this.niveaux = data;
        if (this.currentUser.niveau) {
          const position = this.niveaux.findIndex(it => it.id === this.currentUser.niveau.id);
          this.listeNiveau = [];
          for (let index = 0; index <= position; index++) {
            this.listeNiveau.push(this.niveaux[index]);
          }
        }
        this.getAllExercicesForUser();
      });
    }).then(() => {
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'echauffement').then(item => {
        this.echauffement = item;
      });
    });
  }


  getExercicesByScenario(genre, exerciceage, niveau, position) {
    this.exercicesService.getExercicesForUser(genre, exerciceage, niveau, position)
          .then(data => {
            data.forEach(item => {
              const id = this.listeExercices.findIndex(it => it.id === item.id);
              if (id < 0) {
                this.listeExercices.push(item);
              }
            });
    });
  }

  getAllExercicesForUser() {
    // determination de l'age du user
    const userage = new Date().getFullYear() - new Date(this.currentUser.datedenaissance).getFullYear();
    let exerciceage = '';
    if (userage > 19 && userage < 50) {
      exerciceage = 'SUP19&INF50';
    } else if (userage < 19) {
      exerciceage = 'SUP19';
    } else if (userage < 50) {
      exerciceage = 'INF50';
    } else {
      exerciceage = 'TOUT';
    }

    // determination de la position
    let position = 'toutes';
    if (this.currentUser.position === 'neserelevepasseul') {
      position = 'debout';
    }

    // parcours des niveaux et recuperation de la liste des exercices
    this.listeExercices = [];
    for (const niveau of this.listeNiveau) {
        // determination des exercices spécifique aux caractéristiques du
        this.getExercicesByScenario(this.currentUser.genre, exerciceage, niveau, position);

        // determination des exercices de tous les sexes
        this.getExercicesByScenario('H&F', exerciceage, niveau, position);

        // determination des exercices de tous les sexes et tous les ages
        this.getExercicesByScenario('H&F', 'TOUT', niveau, position);

        // determination des exercices de tous les ages
        this.getExercicesByScenario(this.currentUser.genre, 'TOUT', niveau, position);
  }
    // console.log(this.listeExercices);
}

}
