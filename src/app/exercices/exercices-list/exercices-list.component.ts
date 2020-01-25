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

  displayedColumns: string[] = [
                                'numero',
                                'nom',
                                'duree',
                                'position',
                                'ageminimal',
                                'agemaximal',
                                'nbrerepetitionechauffement',
                                'nbrrepetitionsenior',
                                'type',
                                'echauffement',
                                'accessalledesport',
                                'regime',
                                'date',
                                'niveau',
                                'action'
                              ];
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

  updateTypeField(value: string, attribut: string, element: Exercice) {
    if (value) {
      console.log(value);
      this.exercicesService.newUpdateVersion(element, attribut, value);
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
