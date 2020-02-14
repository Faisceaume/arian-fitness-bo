import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { PathologiesService } from '../../shared/pathologies/pathologies.service';
import { ExercicesService } from '../exercices.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Listes } from 'src/app/shared/listes';

@Component({
  selector: 'app-exercices-series',
  templateUrl: './exercices-series.component.html',
  styleUrls: ['./exercices-series.component.css']
})
export class ExercicesSeriesComponent implements OnInit {

  /*  */
  pathologies: any[];
  dataSource: MatTableDataSource<any>;
  exerciceSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nom', 'consigne', 'timestamp', 'senior', 'type', 'action'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  /*  */
  listes: Listes;
  exerciceList: any[];
  nbreReptSenior = new Listes().nbrerepetsenior;
  nbreSerie = new Listes().nbrseries;
  nbreTempsDeRepos = new Listes().nbrreposexercice;

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
  exo: FormArray;
  part1 = true;
  part2 = false;
  nomIsEntered: boolean;
  disabled = true;
  disabled2 = false;
  nom = '';
  displayEditForm = true;
  displayExercice = true;

  /* Edit */
  idToEdit: string;

  /* Données pour l'exercice */

  constructor(
    private formBuilder: FormBuilder,
    private pathologiesService: PathologiesService,
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

    this.exerciceService.getAllExercices();
    this.exerciceService.exerciceSubject.subscribe(data => {
      this.exerciceSource = new MatTableDataSource( data );
      this.exerciceList = this.exerciceSource.filteredData;
      this.exerciceAdded = [];
    });
    /*this.initForm2();*/
    this.initForm();
    console.log( this.formulaire );
    
  }

  initForm() {
    this.formulaire = this.formBuilder.group({
      nom: ['', Validators.required],
      consigne : ['', Validators.required],
      senior: ['', Validators.required],
      type: ['', Validators.required],
      pathology: [this.pathologies, Validators.required],
      exercices: ['', Validators.required],
      exo: this.formBuilder.array([], Validators.required)
    });
  }

  getExo(): FormArray {
    return this.formulaire.get('exo') as FormArray;
  }

  newExo(): FormGroup {
    return this.formBuilder.group({
      nbreReptSenior: ['', Validators.required],
      nbreSerie: ['', Validators.required],
      nbreTempsDeRepos: ['', Validators.required]
    });
  }

  addExo() {
    this.getExo().push( this.newExo() );
  }

  removeExo(i) {
    this.getExo().removeAt( i );
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
    this.displayEditForm = false;
    this.displayExercice = false;
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
        this.displayEditForm = true;
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
        consigne: [data.consigne, Validators.required],
        senior: [data.senior, Validators.required],
        type: [data.type, Validators.required],
        pathology: [data.pathology, Validators.required],
        exo: this.formBuilder.array([], Validators.required),
        exercices: ['', Validators.required]
      });
      this.formulaire.setControl('exo', this.setControlDetailExo(data.detailExos));
      this.displayExercice = true;
      this.nomIsEntered = true;
    });
    
    console.log( this.exerciceAdded );
  }

  setControlDetailExo(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptSenior: [s.nbreReptSenior, Validators.required],
        nbreSerie: [s.nbreSerie, Validators.required],
        nbreTempsDeRepos: [s.nbreTempsDeRepos, Validators.required]
      }));
    });
    return formArray;
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
    console.log( ex );
    if (ex === '') {

    } else {
      this.exerciceAdded.push( ex );
      this.addExo();
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
    this.removeExo(i);
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
      const data3 = this.formulaire.get('exo').value;
      console.log( data3 );
      this.exerciceService.createSerieExercice(data1, data2, data3);
      this.initForm();
      this.returnTolist();
    } else if ( this.isClickToEdit ) {
      const data1  = this.formulaire.value;
      const data2 = this.exerciceAdded;
      const data3 = this.formulaire.get('exo').value;
      console.log( data1, data2 );
      const prom = new Promise((resolve, reject) => {
        this.exerciceService.updateSerieExerciceFixe(this.idToEdit, data1, data2, data3);
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
