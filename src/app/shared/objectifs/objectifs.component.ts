import { Component, OnInit, ViewChild } from '@angular/core';
import { Objectif } from './objectif';
import { ObjectifsService } from './objectifs.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ObjectifsCrudComponent } from './objectifs-crud/objectifs-crud.component';

@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: ['./objectifs.component.css']
})
export class ObjectifsComponent implements OnInit {

  objectifs: Objectif[];
  displayedColumns: string[] = ['nom', 'date', 'acronyme', 'premium', 'action'];
  dataSource: MatTableDataSource<Objectif>;

  constructor(private objectifsService: ObjectifsService, private matDialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
      this.dataSource = new MatTableDataSource<Objectif>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(objectif: Objectif) {
    if (confirm('Vraiment supprimer ?')) {
      this.objectifsService.deleteObjectif(objectif);
    }
  }

  onCreate() {
    this.openMatDialog(null);
  }

  onUpdate(objectif: Objectif) {
    this.openMatDialog(objectif);
  }

  openMatDialog(information: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = information;
    this.matDialog.open(ObjectifsCrudComponent, dialogConfig);
  }

  updateField(beforeStatut: boolean, attribut: string, element: Objectif) {
    if (beforeStatut) {
      this.objectifsService.newUpdateVersion(element, attribut, false);
    } else {
      this.objectifsService.newUpdateVersion(element, attribut, true);
    }
  }
}
