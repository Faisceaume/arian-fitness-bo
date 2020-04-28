import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { TropheeFormComponent } from '../trophee-form/trophee-form.component';
import { Trophee } from '../trophee';
import { TropheesService } from '../trophees.service';

@Component({
  selector: 'app-trophees-list',
  templateUrl: './trophees-list.component.html',
  styleUrls: ['./trophees-list.component.css']
})
export class TropheesListComponent implements OnInit {

  dataSource: MatTableDataSource<Trophee>;
  displayedColumns:string[] = ['nom', 'details', 'explications', 'timestamp', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public matDialog: MatDialog,
    private tropheesService: TropheesService
    ) { }

  ngOnInit() {
    this.tropheesService.getAllTrophees();
    this.tropheesService.tropheesListSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource( data );
      this.dataSource.paginator = this.paginator;
    });
    
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = false;
    const dialogRef = this.matDialog.open(TropheeFormComponent, dialogConfig);
  }

  onDelete(idTrophee: string) {
    this.tropheesService.deleteTrophee(idTrophee);
  }

}
