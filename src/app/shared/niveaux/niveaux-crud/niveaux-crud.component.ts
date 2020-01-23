import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-niveaux-crud',
  templateUrl: './niveaux-crud.component.html',
  styleUrls: ['./niveaux-crud.component.css']
})
export class NiveauxCrudComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NiveauxCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
