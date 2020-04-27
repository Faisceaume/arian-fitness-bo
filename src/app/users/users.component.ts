import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersService } from './users.service';
import { User } from './user';
import { Router } from '@angular/router';
import { ExercicesService } from '../exercices/exercices.service';
import { MaterielsService } from '../materiels/materiels.service';
import { CategoriesService } from '../shared/categories/categories.service';
import { Exercice } from '../exercices/exercice';
import { Materiel } from '../materiels/materiel';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['email', 'nom', 'prenom', 'genre', 'abonnement', 'action'];
  dataSource: MatTableDataSource<User>;
  showError: boolean;

  constructor(private matDialog: MatDialog,
              public usersService: UsersService,
              private router: Router,
              private exercicesService: ExercicesService,
              private materielsServie: MaterielsService,
              private categoriesService: CategoriesService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.usersService.getAllUsers();
    this.usersService.userSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.sort = this.sort;
    });

  }

  onEdit(user: User) {
    this.router.navigate(['/users/user-details', user.id]);
  }

  onDelete(user: User) {
    if (confirm('Confirmer la suppression ?')) {
      this.usersService.deleteUser(user);
    }
  }

  openMatDialog() {
    this.showError = true;
    this.usersService.asError = false;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog.open(UserFormComponent, dialogConfig);
  }

}
