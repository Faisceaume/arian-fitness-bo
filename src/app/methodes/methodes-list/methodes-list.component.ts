import { Component, OnInit, ViewChild } from '@angular/core';
import { Methode } from '../methode';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MethodesService } from '../methodes.service';

@Component({
  selector: 'app-methodes-list',
  templateUrl: './methodes-list.component.html',
  styleUrls: ['./methodes-list.component.css']
})
export class MethodesListComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'acronyme',
    'orientation',
    'date',
    'dureeminimum',
    'senior',
    'global',
    'niveau',
    'action'
  ];
dataSource: MatTableDataSource<Methode>;

  constructor(private methodesService: MethodesService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.methodesService.getAllMethodes();
    this.methodesService.methodeSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Methode>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(element: Methode) {
    if (confirm('Confirmer la suppression de cette méthode?')) {
      this.methodesService.deleteMethode(element);
    }
  }

  updateAnyField(value: string, attribut: string, element: Methode) {
    if (value) {
      console.log(value);
      this.methodesService.newUpdateVersion(element, attribut, value);
    }
  }

  updateField(beforeStatut: boolean, attribut: string, element: Methode) {
    if (beforeStatut) {
      this.methodesService.newUpdateVersion(element, attribut, false);
    } else {
      this.methodesService.newUpdateVersion(element, attribut, true);
    }
  }

}
