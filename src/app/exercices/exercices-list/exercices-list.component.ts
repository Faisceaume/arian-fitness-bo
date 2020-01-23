import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Exercice } from '../exercice';
import { Subscription } from 'rxjs';
import { ExercicesService } from '../exercices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercices-list',
  templateUrl: './exercices-list.component.html',
  styleUrls: ['./exercices-list.component.css']
})
export class ExercicesListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'numero', 'nom', 'type',
                                'descriptif', 'niveau', 'duree', 'position', 'action',
                                'agemaximal', 'ageminimal', 'echauffement', 'nbrerepetitionechauffement',
                                'nbrrepetitionsenior', 'accessalledesport', 'regime', 'consigne'];
  dataSource: MatTableDataSource<Exercice>;
  exerciceSubscription: Subscription;

  constructor(private exercicesService: ExercicesService,
              private router: Router) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.exercicesService.getAllExercices();
    this.exerciceSubscription = this.exercicesService.exerciceSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Exercice>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(materiel: Exercice) {
    this.router.navigate(['materiels', materiel.id]);
  }

  onDelete(materiel: Exercice) {
    if (confirm('Vraiment supprimer ?')) {
      this.exercicesService.deleteExercice(materiel);
    }
  }

  updateField(beforeStatut: boolean, attribut: string, element: Exercice) {
    if (beforeStatut) {
      this.exercicesService.newUpdateVersion(element, attribut, false);
    } else {
      this.exercicesService.newUpdateVersion(element, attribut, true);
    }
  }

  ngOnDestroy(): void {
    this.exerciceSubscription.unsubscribe();
  }

}
