import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PathologiesService } from '../../shared/pathologies/pathologies.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { ExercicesService } from '../exercices.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Exercice } from '../exercice';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  exerciceSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom', 'timestamp', 'senior', 'objectifJour', 'idPathologie', 'action'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataIsLoad = false;
  selectExercices = false;
  exerciceList: any[];
  filteredExercice: Observable<any[]>;
  exerciceForm: FormGroup;
  exerciceAdded: any[];
  exerciceAddLenght: number;
  isDisplayFormExo = false;
  isFromEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private pathologiesService: PathologiesService,
    private objectifService: ObjectifsService,
    private exerciceService: ExercicesService
    ) {
      /*this.filteredExercice = this.exerciceCtrl.valueChanges.pipe(
        startWith(''),
        map(exercice => exercice ? this._filterExercices(exercice) : this.exerciceList.slice() )
      );*/
     }

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
      senior: ['', Validators.required],
      objectifJour: [this.objectifs, Validators.required],
      idPathologie: [this.pathologies, Validators.required]
    });
  }


  /* ADD, EDIT, DELETE */
  onSubmit() {
    this.exerciceForm = this.formBuilder.group({
      exercice: ['', [Validators.required] ]
    });
    this.selectExercices = true;
    this.isdisplayedAdd = false;
    this.exerciceService.getAllExercices();
    this.exerciceService.exerciceSubject.subscribe(data => {
      this.exerciceSource = new MatTableDataSource( data );
      this.exerciceList = this.exerciceSource.filteredData;
      this.isDisplayFormExo = true;
      this.exerciceAdded = [];
      this.exerciceAddLenght = this.exerciceAdded.length;
    });
  }

  displayFn(exercice: any): string {
    return exercice.nom;
  }

  applyFilter(filterValue: string) {
    this.exerciceSource.filter = filterValue.trim().toLowerCase();
    this.exerciceList = this.exerciceSource.filteredData;
  }

  onAddExercice() {
    const ex =  this.exerciceForm.get('exercice').value;
    this.exerciceAdded.push( ex );
    this.exerciceAddLenght = this.exerciceAdded.length;
    this.exerciceForm = this.formBuilder.group({
      exercice: ['', Validators.required]
    });
  }

  clearExo(i) {
    this.exerciceAdded.splice(i, 1);
    this.exerciceAddLenght = this.exerciceAdded.length;
  }

  onAddSerieFixe() {
    if ( this.isFromEdit ) {
      const data1 = this.serieFormEdit.value;
      const data2 = this.exerciceAdded;
      const data = Object.assign(data1, {exercice: data2});
      this.exerciceService.updateSerieExerciceFixe(this.idOneSerie, data);
      this.selectExercices = false;
      this.isDispalayList = true;
      this.isFromEdit = false;
    } else {
      const data1  = this.serieFormAdd.value;
      const data2 = this.exerciceAdded;
      const data = Object.assign(data1, {exercice: data2});
      this.exerciceService.createSerieExercice(data);
      this.returnToAdd();
      this.initForm();
    }
  }

  /*private _filterExercices(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.exerciceList.filter(exercice => exercice.consignecourte.toLowerCase().indexOf(filterValue) === 0);
  }*/

  onEdit( id ) {
    this.isDisplayEdit = true;
    this.isdisplayedAdd = this.isDispalayList = false;
    this.exerciceService.getOneSerieExercice( id );
    this.exerciceService.oneSerieExerciceFixeSubject.subscribe(data => {
      this.idOneSerie = data.id;
      console.log( data );
      this.serieFormEdit = this.formBuilder.group({
        nom: [data.nom, Validators.required],
        senior: [data.senior, Validators.required],
        objectifJour: [data.objectifJour, Validators.required],
        idPathologie: [data.idPathologie, Validators.required]
      });
      this.dataIsLoad = true;
      this.exerciceAdded = data.exercice;
      this.exerciceAddLenght = this.exerciceAdded.length;
    });
  }

  onDelete( id ) {
    this.exerciceService.deleteSerieExerciceFixe(id);
  }

  onUpdate() {
    this.exerciceForm = this.formBuilder.group({
      exercice: ['', [Validators.required] ]
    });
    this.selectExercices = true;
    this.isDisplayEdit = false;
    this.isFromEdit = true;
    this.exerciceService.getAllExercices();
    this.exerciceService.exerciceSubject.subscribe( data => {
      this.exerciceSource = new MatTableDataSource( data );
      this.exerciceList = this.exerciceSource.filteredData;
      this.isDisplayFormExo = true;
    });
    /*const data = this.serieFormEdit.value;
    this.exerciceService.updateSerieExerciceFixe(this.idOneSerie, data);
    this.hiddenEdit();*/
  }


  /* AFFICHAGE */
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
  returnToAdd() {
    if ( this.isFromEdit ) {
      this.isDisplayEdit = true;
      this.selectExercices = this.isFromEdit = false;
    } else {
    this.isdisplayedAdd = true;
    this.selectExercices = false;
    this.exerciceAdded = [];
    }
  }

}
