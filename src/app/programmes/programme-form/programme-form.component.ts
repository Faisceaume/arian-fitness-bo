import { Component, OnInit } from '@angular/core';
import { Programme } from '../programme';
import { MatDialogRef } from '@angular/material';
import { ProgrammesService } from '../programmes.service';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';

@Component({
  selector: 'app-programme-form',
  templateUrl: './programme-form.component.html',
  styleUrls: ['./programme-form.component.css']
})
export class ProgrammeFormComponent implements OnInit {

  formData: Programme;
  objectifs: Objectif[];

  constructor(private programmesService: ProgrammesService,
              public dialogRef: MatDialogRef<ProgrammeFormComponent>,
              private objectifsService: ObjectifsService) { }

  ngOnInit() {
    this.formData = {
      id: null,
      numero: null,
      acronyme: '',
      extra: false,
      duree: null,
      frequence: null,
      niveau: null,
      custompointsfaibles: false,
      timestamp: ''
    } as Programme;

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });
  }

  onSubmit() {
    this.formData.objectifs = this.objectifs;
    this.programmesService.createProgramme(this.formData);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
