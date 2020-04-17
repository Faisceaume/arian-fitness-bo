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

  constructor(private usersService: UsersService,
              private exercicesService: ExercicesService,
              private programmesService: ProgrammesService,
              private exercicesSeriesService: ExercicesSeriesService,
              private pathologiesService: PathologiesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    // this.exercicesService = this.exercicesService.getExercicesForUser(id);

    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.currentUser = item;
      this.senior = this.currentUser.senior ? 'uniquement' : 'hors';
      if (this.currentUser.pathologie) {
        this.pathologie = this.currentUser.pathologie;
        this.pathologiesService.getSinglePathologie(this.pathologie.id).then(patho => {
          this.currentPathologie = patho;
          console.log(this.currentPathologie.exercicesCategorie);
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
              console.log(bloc.categoriesexercices);
            });
            if (local.length > 0) {
              this.lancementSerieFixePathos = true;
            }
          }
        }
      });
    }).then(() => {
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'echauffement').then(item => {
        this.echauffement = item;
      });
    });
  }

}
