import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MaterielsService } from '../materiels.service';
import { Materiel } from '../materiel';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materiels-list',
  templateUrl: './materiels-list.component.html',
  styleUrls: ['./materiels-list.component.css']
})
export class MaterielsListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'nom', 'postefixe', 'visibility', 'action'];
  dataSource: MatTableDataSource<Materiel>;
  materielsSubscription: Subscription;

  constructor(private materielsService: MaterielsService,
              private router: Router) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.materielsService.getAllMateriels();
    this.materielsSubscription = this.materielsService.materielSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Materiel>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(materiel: Materiel) {
    this.router.navigate(['materiels', materiel.id]);
  }

  onDelete(materiel: Materiel) {
    if (confirm('Vraiment supprimer ?')) {
      this.materielsService.deleteMateriel(materiel);
    }
  }

  ngOnDestroy(): void {
    this.materielsSubscription.unsubscribe();
  }

}
