import { NutritionService } from './../nutrition.service';
import { PrognutFormComponent } from './../prognut-form/prognut-form.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Prognut } from '../prognut';

@Component({
  selector: 'app-prognuts-list',
  templateUrl: './prognuts-list.component.html',
  styleUrls: ['./prognuts-list.component.css']
})
export class PrognutsListComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'scenario', 'objectif', 'action'];
  dataSource: MatTableDataSource<Prognut>;

  constructor(private nutritionService: NutritionService,
              public dialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.nutritionService.getAllProgNuts();
    this.nutritionService.prognutsSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Prognut>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(PrognutFormComponent, {
      width: '60%',
    });
  }

  onDelete(item: Prognut) {
    if (confirm('Confirmation de suppression')) {
      this.nutritionService.deleteProgNut(item.id);
    }
  }
}
