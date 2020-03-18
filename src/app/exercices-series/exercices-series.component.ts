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
    private exercicesSeriesService: ExercicesSeriesService,
    private router: Router
    ) {}

  ngOnInit() {

    this.exercicesSeriesService.getAllSerieExercice();
    this.exercicesSeriesService.serieExerciceFixeSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource( data );
      this.dataSource.sort = this.sort;


  // SCRIPT EXERCICE ON SERIE-FIXE
/*
      data.forEach((item: ExerciceSerie) => {
            const serieExercice = item.exercices;
            const allData: ExerciceAvance[] = [];

            serieExercice.forEach((item2: any) => {
              const exerciceAvance = new ExerciceAvance();
              exerciceAvance.exercice = item2.exercice.id;
              exerciceAvance.nomexercice = item2.exercice.nom;
              exerciceAvance.visibilityexercice = item2.exercice.visibility;
              exerciceAvance.nbrederepetition = item2.nbrederepetition;
              exerciceAvance.nbredeserie = item2.nbredeserie;
              exerciceAvance.tempsderepos = item2.tempsderepos;

              allData.push(exerciceAvance);
              });
            const field = allData.map((obj) => {
                return Object.assign({}, obj);
              });
            this.exercicesSeriesService.newUpdateVersion(item, 'exercices', field);
          });
    */


    // SCRIPT PATHOLOGIE ON SERIE-FIXE
    /*
      data.forEach((item: ExerciceSerie) => {

      const pathologies = item.pathologies;
      const allData: PathologieAvance[] = [];

      pathologies.forEach((item2: any) => {
        const local = new PathologieAvance();
        local.id = item2.id;
        local.acronyme = item2.acronyme;
        local.nom = item2.nom;

        allData.push(local);
      });

      const field = allData.map((obj) => {
        return Object.assign({}, obj);
      });
      this.exercicesSeriesService.newUpdateVersion(item, 'pathologies', field);
    });
    */



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
