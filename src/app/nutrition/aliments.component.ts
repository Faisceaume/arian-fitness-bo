import { NutritionService } from './nutrition.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { AlimentFormComponent } from './aliment-form/aliment-form.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Aliment } from './aliment';

@Component({
  selector: 'app-aliments',
  templateUrl: './aliments.component.html',
  styleUrls: ['./aliments.component.css']
})
export class AlimentsComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'source', 'valide', 'proteines', 'glucides',
                                 'lipides', 'fibressoir', 'fibresmidi', 
                                 'collation', 'agrement'
                                 , 'action'];
  dataSource: MatTableDataSource<Aliment>;

  constructor(public dialog: MatDialog,
              private nutritionService: NutritionService) { }

@ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.nutritionService.getAllAliments();
    this.nutritionService.alimentsSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource<Aliment>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(AlimentFormComponent, {
      width: '60%',
    });
  }

  updateField(beforeStatut: boolean, attribut: string, element: Aliment) {
    if (beforeStatut) {
      this.nutritionService.newUpdateVersion(element, attribut, false);
    } else {
      this.nutritionService.newUpdateVersion(element, attribut, true);
    }
  }

  onDelete(item: Aliment) {
    if (confirm('Confirmation de suppression')) {
      this.nutritionService.deleteAliment(item.id);
    }
  }
}
