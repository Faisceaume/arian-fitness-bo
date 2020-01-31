import { Component, OnInit, ViewChild } from '@angular/core';
import { Pathologie } from './pathologie';
import { PathologiesService } from './pathologies.service';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { PathologiesCrudComponent } from './pathologies-crud/pathologies-crud.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
  selector: 'app-pathologies',
  templateUrl: './pathologies.component.html',
  styleUrls: ['./pathologies.component.css']
})
export class PathologiesComponent implements OnInit {

  pathologies: Pathologie[];
  displayedColumns: string[] = ['nom', 'date', 'acronyme', 'mat_cat', 'exe_cat', 'action'];
  dataSource: MatTableDataSource<Pathologie>;

  constructor(private pathologiesService: PathologiesService,
              private matDialog: MatDialog,
              private categoriesService: CategoriesService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.pathologiesService.getAllPathologies();
    this.pathologiesService.pathologieSubject.subscribe(data => {
      this.pathologies = data;
      this.dataSource = new MatTableDataSource<Pathologie>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(pathologie: Pathologie) {
    if (confirm('Vraiment Supprimer ?')) {
      this.pathologiesService.deletePathologie(pathologie);
    }
  }

  onCreate() {
    this.categoriesService.resetChipsSelectedElement();
    this.openMatDialog(null);
  }

  onUpdate(pathologie: Pathologie) {
    this.openMatDialog(pathologie);
  }

  openMatDialog(information: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = information;
    this.matDialog.open(PathologiesCrudComponent, dialogConfig);
  }
}
