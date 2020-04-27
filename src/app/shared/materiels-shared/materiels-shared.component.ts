import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Materiel } from 'src/app/materiels/materiel';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { Exercice } from 'src/app/exercices/exercice';

@Component({
  selector: 'app-materiels-shared',
  templateUrl: './materiels-shared.component.html',
  styleUrls: ['./materiels-shared.component.css']
})
export class MaterielsSharedComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'visibility', 'categories', 'action'];
  dataSource: MatTableDataSource<Materiel>;

  constructor(private materielsService: MaterielsService,
              public dialogRef: MatDialogRef<MaterielsSharedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private exercicesServices: ExercicesService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.materielsService.getAllMateriels();
    this.materielsService.materielSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Materiel>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onCkecked(event, item: Materiel) {
    if (event.checked) {
      this.materielsService.addMaterielSelected(item);
      this.materielsService.writeExercice(item, this.data.currentExercice);
    } else {
      this.materielsService.deleteMaterielSelected(item);
      this.materielsService.deleteExercice(item, this.data.currentExercice);
    }

    if (this.data != null) {
      this.exercicesServices.newUpdateVersion(this.data.currentExercice as Exercice, 'materiels',
                                             this.materielsService.materielsSelected);
    }
  }

}
