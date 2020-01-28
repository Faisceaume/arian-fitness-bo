import { Component, OnInit, ViewChild } from '@angular/core';
import { Materiel } from 'src/app/materiels/materiel';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MaterielsService } from 'src/app/materiels/materiels.service';

@Component({
  selector: 'app-materiels-shared',
  templateUrl: './materiels-shared.component.html',
  styleUrls: ['./materiels-shared.component.css']
})
export class MaterielsSharedComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'date', 'visibility', 'categories', 'action'];
  dataSource: MatTableDataSource<Materiel>;

  constructor(private materielsService: MaterielsService) { }

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
    } else {
      this.materielsService.deleteMaterielSelected(item);
    }
  }

}
