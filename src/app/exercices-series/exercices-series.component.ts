import { PathologieAvance } from './pathologie-avance';
import { ExerciceAvance } from 'src/app/exercices-series/exercice-avance';
import { ExercicesSeriesService } from './exercices-series.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { Listes } from 'src/app/shared/listes';
import { SerieFormComponent } from './serie-form/serie-form.component';
import { ExercicesService } from '../exercices/exercices.service';
import { Router } from '@angular/router';
import { ExerciceSerie } from './exercice-serie';
import { Exercice } from '../exercices/exercice';

@Component({
  selector: 'app-exercices-series',
  templateUrl: './exercices-series.component.html',
  styleUrls: ['./exercices-series.component.css']
})
export class ExercicesSeriesComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom', 'timestamp', 'senior', 'type', 'action'];
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
    private exercicesSeriesService: ExercicesSeriesService,
    private router: Router
    ) {}

  ngOnInit() {

    this.exercicesSeriesService.getAllSerieExercice();
    this.exercicesSeriesService.serieExerciceFixeSubject.subscribe((data: ExerciceSerie[]) => {
      this.dataSource = new MatTableDataSource( data );
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(element: ExerciceSerie) {
    if (confirm('Confirmation de la suppression')) {
      this.exercicesSeriesService.deleteExerciceSerie(element);
    }
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
