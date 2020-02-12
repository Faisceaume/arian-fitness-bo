import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { PathologiesService } from '../../shared/pathologies/pathologies.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { ExercicesService } from '../exercices.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Exercice } from '../exercice';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Listes } from 'src/app/shared/listes';

@Component({
  selector: 'app-exercices-series',
  templateUrl: './exercices-series.component.html',
  styleUrls: ['./exercices-series.component.css']
})
export class ExercicesSeriesComponent implements OnInit {

  /*  */
  pathologies: any[];
  objectifs: any[];
  dataSource: MatTableDataSource<any>;
  exerciceSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom', 'timestamp', 'senior', 'objectifJour', 'action'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  /*  */
  listes: Listes;
  exerciceList: any[];

  /* Affichage  && Navigation */
  displayList = true;
  displayForm = false;
  /*  */
  isClickToEdit = false;
  isClickToAdd = false;

  exerciceAdded = [];
  exerciceAddLenght: number;

  /* formulaire */
  formulaire: FormGroup;
  part1 = true;
  part2 = false;
  nomIsEntered: boolean;
  disabled = true;
  disabled2 = false;
  nom = '';

  /* Edit */
  idToEdit: string;

  constructor(
    private formBuilder: FormBuilder,
    private pathologiesService: PathologiesService,
    private objectifService: ObjectifsService,
    private exerciceService: ExercicesService
    ) {}

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

    this.exerciceService.getAllExercices();
    this.exerciceService.exerciceSubject.subscribe(data => {
      this.exerciceSource = new MatTableDataSource( data );
      this.exerciceList = this.exerciceSource.filteredData;
      this.exerciceAdded = [];
    });

    this.initForm();
  }

  initForm() {
    this.formulaire = this.formBuilder.group({
      nom: ['', Validators.required],
      senior: ['', Validators.required],
      objectifJour: [this.objectifs, Validators.required],
      pathology: [this.pathologies, Validators.required],
      exercices: ['', Validators.required]
    });
  }


  /* AFFICHAGE */
  returnTolist() {
    this.displayForm = this.isClickToEdit = this.isClickToAdd = false;
    this.displayList = !this.displayList;
    this.part1 = true;
    this.part2 = false;
    this.nomIsEntered = false;
    this.exerciceAdded = [];
    this.initForm();
    this.nom = '';
  }
  goToFormForAdd() {
    this.displayForm = this.isClickToAdd = true;
    this.displayList = !this.displayForm;
  }
  goToFormForEdit(id) {
    this.displayForm = this.isClickToEdit = true;
    this.displayList = !this.displayForm;
    this.prepareEdit(id);
  }
  showPart() {
    this.part2 = true;
    this.part1 = false;
    this.nom = this.formulaire.get('nom').value;
    if (this.isClickToEdit) {
      this.exerciceService.getSerieExerciceFromExercice(this.idToEdit);
      this.exerciceService.oneSerieFixeFromExerciceSubject.subscribe(data => {
        this.exerciceAdded = data.exercices;
        this.formulaire.patchValue({exercices: this.exerciceAdded});
        if ( this.exerciceAdded.length >= 1) {
          this.disabled2 = false;
        }
      });
    }
  }
  hidePart() {
    this.part1 = true;
    this.part2 = false;
  }

  /* Verification */
  onKeyUp() {
    if ( this.formulaire.get('nom').value !== '') {
      this.nomIsEntered = true;
    } else {
      this.nomIsEntered = false;
    }
  }
  activeButton() {
    this.disabled = false;
  }
  prepareEdit(id) {
    console.log( id );
    this.exerciceService.getOneSerieExercice(id);
    this.exerciceService.oneSerieExerciceFixeSubject.subscribe(data => {
      this.idToEdit = id;
      this.formulaire = this.formBuilder.group({
        nom: [data.nom, Validators.required],
        senior: [data.senior, Validators.required],
        objectifJour: [data.objectifJour, Validators.required],
        pathology: [data.pathology, Validators.required],
        exercices: ['', Validators.required]
      });
      this.nomIsEntered = true;
    });
  }


  /* Affichage exercice et filtrage */
  displayFn(exercice: any): string {
    return exercice.nom;
  }
  applyFilter(filterValue: string) {
    if ( filterValue === '' ) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.exerciceSource.filter = filterValue.trim().toLowerCase();
    this.exerciceList = this.exerciceSource.filteredData;
  }
  onAddExercice() {
    const ex =  this.formulaire.get('exercices').value;
    if (ex === '') {

    } else {
      this.exerciceAdded.push( ex );
      this.exerciceAddLenght = this.exerciceAdded.length;
      this.formulaire.patchValue({
        exercices: ['', Validators.required]
      });
      if ( this.exerciceAddLenght >= 1 ) {
        this.disabled2 = false;
      }
      this.disabled = true;
    }
  }
  clearExo(i) {
    this.exerciceAdded.splice(i, 1);
    this.exerciceAddLenght = this.exerciceAdded.length;
    if ( this.exerciceAddLenght === 0 ) {
      this.disabled2 = true;
    }
  }


  /* ADD EDIT DELETE */
  onAddOrEditSerieFixe() {
    if ( this.isClickToAdd ) {
      const data1 = this.formulaire.value;
      const data2 = this.exerciceAdded;
      console.log( data1, data2 );
      this.exerciceService.createSerieExercice(data1, data2);
      this.initForm();
      this.returnTolist();
    } else if ( this.isClickToEdit ) {
      const data1  = this.formulaire.value;
      const data2 = this.exerciceAdded;
      console.log( data1, data2 );
      const prom = new Promise((resolve, reject) => {
        this.exerciceService.updateSerieExerciceFixe(this.idToEdit, data1, data2);
        resolve();
      });
      prom.then(() => {
        this.returnTolist();
        this.initForm();
      });

    }
  }

  onDelete( id ) {
    this.exerciceService.deleteSerieExerciceFixe(id);
  }


}
