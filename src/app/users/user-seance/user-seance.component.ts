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
  programmes: Programme[];

  constructor(private usersService: UsersService,
              private programmesService: ProgrammesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.currentUser = item;
    }).then(() => {
      this.programmesService
      .getProgrammeByNiveauAndFrequenceAndObjectifs(this.currentUser);
      this.programmesService.prognivsSubject.subscribe(data => {
        this.programmes = data;
        console.log(data);
      });
    });
  }

}
