import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UsersService } from 'src/app/users/users.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  formData: User;

  constructor(private usersService: UsersService,
              public dialogRef: MatDialogRef<UserFormComponent>) { }

  ngOnInit() {
    this.formData =  {
      id: null,
      email: '',
      nom: '',
      prenom: '',
      datedenaissance: '',
      abonnement: null,
      premium: false,
      datefindepremium: '',
      tarif: '',
      frequence: null,
      telephone: '',
      genre: 'H',
      password: '',
      datedernierlog: '',
      datedernieremaj: '',
      senior: false,
      niveau: null,
      modereprise: '0',
      pathologies: null,
      positionseance: 1,
      objectif: null,
      niveauinscription: null,
      niveauavantperiodeoff: null,
      positionparcoursniveau: 1,
      trophee: '',
      frequenceparjour: null,
      parcoursnutrition: '',
      photo: null,
      timestamp: '',
    } as unknown as  User;
  }

  onSubmit() {
    this.usersService.createUser(this.formData);
    this.dialogRef.close();
  }
}
