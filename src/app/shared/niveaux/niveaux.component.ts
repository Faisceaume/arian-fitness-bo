import { Component, OnInit, ViewChild } from '@angular/core';
import { Niveau } from './niveau';
import { NiveauxService } from './niveaux.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { NiveauxCrudComponent } from './niveaux-crud/niveaux-crud.component';

@Component({
  selector: 'app-niveaux',
  templateUrl: './niveaux.component.html',
  styleUrls: ['./niveaux.component.css']
})
export class NiveauxComponent implements OnInit {

  niveaux: Niveau[];
  displayedColumns: string[] = ['nom', 'acronyme', 'nombre', 'repetitionexercice',
                               'nbrsemaine', 'action'];
  dataSource: MatTableDataSource<Niveau>;

  constructor(private niveauxService: NiveauxService, private matDialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
      this.dataSource = new MatTableDataSource<Niveau>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(niveau: Niveau) {
    if (confirm('Confirmer la suppression ?')) {
      this.niveauxService.deleteNiveau(niveau);
    }
  }

  onCreate() {
    this.openMatDialog(null);
  }

  onUpdate(niveau: Niveau) {
    this.openMatDialog(niveau);
  }

  openMatDialog(information: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = information;
    this.matDialog.open(NiveauxCrudComponent, dialogConfig);
  }

}
