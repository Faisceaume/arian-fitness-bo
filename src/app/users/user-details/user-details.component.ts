import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FormControl } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { UsersService } from '../users.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  formData: User;
  premiumControl = new FormControl();
  seniorControl = new FormControl();
  datenaissanceControl = new FormControl();
  datefindepremiumControl = new FormControl();
  datedernierlogControl = new FormControl();
  datedernieremajControl = new FormControl();
  toChangeNiveau: boolean;
  niveauSelected: Niveau;
  niveaux: Niveau[];
  modereprise = ['0', '>60J<90J', '>=90J<180J', '>=180J'];

  constructor(private activeRoute: ActivatedRoute,
              private niveauxService: NiveauxService,
              private usersService: UsersService,
              private sharedService: SharedService) { }

  ngOnInit() {
    const id = this.activeRoute.snapshot.params.id;
    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.formData = item;
      this.seniorControl.setValue(item.senior);
      this.premiumControl.setValue(item.premium);
      this.datenaissanceControl.setValue(new Date(item.datedenaissance));
      this.datefindepremiumControl.setValue(new Date(item.datefindepremium));
      this.datedernierlogControl.setValue(new Date(item.datedernierlog));
      this.datedernieremajControl.setValue(new Date(item.datedernieremaj));
      this.sharedService.currentUser = item;

      if (item.photo) {
        this.sharedService.fileUrl = item.photo;
      } else {
        this.sharedService.fileUrl = null;
      }

    });
    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  updateField(attribut: string, value: any, isDate?: boolean) {
    if (isDate) {
      this.usersService.newUpdateVersion(this.formData, attribut, value.getTime());
    } else {
      this.usersService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  ngOnDestroy(): void {
    this.usersService.currentUser = null;
  }
}
