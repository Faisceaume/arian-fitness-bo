import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import  { PathologiesService } from '../../shared/pathologies/pathologies.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { ExercicesService } from '../exercices.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-exercices-series',
  templateUrl: './exercices-series.component.html',
  styleUrls: ['./exercices-series.component.css']
})
export class ExercicesSeriesComponent implements OnInit {

  idOneSerie: string; 
  isdisplayedAdd = false;
  isDisplayEdit = false;
  isDispalayList = true;
  serieFormAdd: FormGroup;
  serieFormEdit: FormGroup;
  serieExerciceFixe: any;
  pathologies: any[];
  objectifs: any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom','timestamp', 'objectifJour', 'idPathologie', 'action'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataIsLoad = false;

  constructor(
    private formBuilder: FormBuilder,
    private pathologiesService: PathologiesService,
    private objectifService: ObjectifsService,
    private exerciceService: ExercicesService
    ) { }

  ngOnInit() {

    this.exerciceService.getAllSerieExercice();
    this.exerciceService.serieExerciceFixeSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource( data );
      this.dataSource.sort = this.sort;
      console.log( data );
    });

    this.pathologiesService.getAllPathologies();
    this.pathologiesService.pathologieSubject.subscribe(data => {
      this.pathologies = data;
    });

    this.objectifService.getAllObjectifs();
    this.objectifService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    this.initForm();
  }

  initForm() {
    this.serieFormAdd = this.formBuilder.group({
      nom: ['', Validators.required],
      objectifJour: [this.objectifs, Validators.required],
      idPathologie: [this.pathologies, Validators.required]
    });
  }

  displayAdd() {
    this.isdisplayedAdd = true;
    this.isDisplayEdit = this.isDispalayList = false;
  }
  hiddenAdd() {
    this.isdisplayedAdd = this.isDisplayEdit = false;
    this.isDispalayList = true;
  }
  hiddenEdit() {
    this.isDisplayEdit = this.isdisplayedAdd = false;
    this.isDispalayList = true;
  }

  onSubmit() {
    const data = this.serieFormAdd.value;
    this.exerciceService.createSerieExercice(data);
    this.initForm();
  }

  onEdit( id ) {
    this.isDisplayEdit = true;
    this.isdisplayedAdd = this.isDispalayList = false;
    this.exerciceService.getOneSerieExercice( id );
    this.exerciceService.oneSerieExerciceFixeSubject.subscribe(data => {
      this.idOneSerie = data.id;
      console.log( data );
      this.serieFormEdit = this.formBuilder.group({
        nom: [data.nom, Validators.required],
        objectifJour: [data.objectifJour, Validators.required],
        idPathologie: [data.idPathologie, Validators.required]
      });
      this.dataIsLoad = true;
    });
  }

  onDelete( id ) {
    this.exerciceService.deleteSerieExerciceFixe(id);
  }

  onUpdate() {
    const data = this.serieFormEdit.value;
    this.exerciceService.updateSerieExerciceFixe(this.idOneSerie, data);
    this.hiddenEdit();
  }

}
