import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pathologies-crud',
  templateUrl: './pathologies-crud.component.html',
  styleUrls: ['./pathologies-crud.component.css']
})
export class PathologiesCrudComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PathologiesCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
