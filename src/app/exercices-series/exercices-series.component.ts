import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { Listes } from 'src/app/shared/listes';
import { SerieFormComponent } from './serie-form/serie-form.component';
import { ExercicesService } from '../exercices/exercices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercices-series',
  templateUrl: './exercices-series.component.html',
  styleUrls: ['./exercices-series.component.css']
})
export class ExercicesSeriesComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom', 'consigne', 'timestamp', 'senior', 'type', 'action'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  /*  */
  listes: Listes;
  exerciceList: any[];
  nbreReptSenior = new Listes().nbrerepetsenior;
  nbreReptExercices = new Listes().nbrerepetexercice;
  nbreTempsDeRepos = new Listes().nbrreposexercice;
  nbreSerie = new Listes().listeNbrexparserie;


  /* Données pour l'exercice */

  constructor(
    private matDialog: MatDialog,
    private exerciceService: ExercicesService,
    private router: Router
    ) {}

  ngOnInit() {
    this.exerciceService.getAllSerieExercice();
    this.exerciceService.serieExerciceFixeSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource( data );
      this.dataSource.sort = this.sort;
    });
  }

  onDelete( id ) {
    this.exerciceService.deleteSerieExerciceFixe(id);
  }

  onEdit(element: any) {
    this.router.navigate(['/exercices-series', 'serie-details', element.id]);
  }

  openFormModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.matDialog.open(SerieFormComponent, dialogConfig);
  }

}
