import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { Exercice } from '../exercice';
import { ExercicesService } from '../exercices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercices-list',
  templateUrl: './exercices-list.component.html',
  styleUrls: ['./exercices-list.component.css']
})
export class ExercicesListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'nom', 'description', 'action'];
  dataSource: MatTableDataSource<Exercice>;
  exerciceSubscription: Subscription;
  allExercice: Exercice[];

  constructor(private exercicesService: ExercicesService,
              private router: Router) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.exercicesService.getAllExercices();
    this.exerciceSubscription = this.exercicesService.exerciceSubject.subscribe( data => {
      this.dataSource = new MatTableDataSource<Exercice>(data);
      this.dataSource.sort = this.sort;
      this.allExercice = data;
    });
  }

  onEdit(exercice: Exercice) {
    this.router.navigate(['exercices', exercice.id]);
  }

  onDelete(exercice: Exercice) {
    if (confirm('Vraiment supprimer ?')) {
      this.exercicesService.deleteExercice(exercice);
    }
  }

  ngOnDestroy(): void {
    this.exerciceSubscription.unsubscribe();
  }

}
