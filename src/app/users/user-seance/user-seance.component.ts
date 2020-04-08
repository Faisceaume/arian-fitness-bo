import { ExerciceSerie } from './../../exercices-series/exercice-serie';
import { ExercicesSeriesService } from './../../exercices-series/exercices-series.service';
import { Seance } from './../../programmes/seance';
import { Programme } from './../../programmes/programme';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ProgrammesService } from 'src/app/programmes/programmes.service';

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

  constructor(private usersService: UsersService,
              private programmesService: ProgrammesService,
              private exercicesSeriesService: ExercicesSeriesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.currentUser = item;
      this.senior = this.currentUser.senior ? 'uniquement' : 'hors';
    }).then(() => {
      this.programmesService
      .getProgrammeByNiveauAndFrequenceAndObjectifs(this.currentUser);
      this.programmesService.prognivsSubject.subscribe(data => {
        if (data.length !== 0) {
          this.programmes = data[0];
          this.seance = this.programmes.seances[this.currentUser.positionseance - 1];
        }
      });
    }).then(() => {
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'echauffement').then(item => {
        this.echauffement = item;
      });
    });
  }

}
