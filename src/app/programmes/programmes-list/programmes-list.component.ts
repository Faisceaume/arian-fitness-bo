import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgrammesService } from '../programmes.service';
import { Programme } from '../programme';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ProgrammeFormComponent } from '../programme-form/programme-form.component';

@Component({
  selector: 'app-programmes-list',
  templateUrl: './programmes-list.component.html',
  styleUrls: ['./programmes-list.component.css']
})
export class ProgrammesListComponent implements OnInit {

  displayedColumns: string[] = ['niveau', 'numero', 'acronyme', 'genre', 'extra',  'date', 'action'];
  dataSource: MatTableDataSource<Programme>;

  constructor(private programmesService: ProgrammesService,
              private router: Router,
              private matDialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.programmesService.getAllProgrammes();
    this.programmesService.programmeSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Programme>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(programme: Programme) {
    this.router.navigate(['programmes', programme.id]);
  }

  onDelete(programme: Programme) {
    if (confirm('Confirmer la suppression ?')) {
      this.programmesService.deleteProgramme(programme);
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    this.matDialog.open(ProgrammeFormComponent, dialogConfig);
  }

}
