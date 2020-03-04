import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
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
  nbreReptEchauf = new Listes().nbrerepetechauffement;
  nbreReptCalme = new Listes().nbrerepetretourcalme;
  nbreReptExercices = new Listes().nbrerepetexercice;
  nbreReptPatho = new Listes().nbrerepetsenior;

  /* Affichage  && Navigation */
  displayList = true;
  displayForm = false;
  /*  */
  isClickToEdit = false;
  isClickToAdd = false;
  /* */
  exos = false;
  exoEchauf = false;
  exoCalme = false;
  exoPatho = false;
  exoTest = false;
  /* */
  formOther = 0;
  formTest = 0;
  once = true;

  /* */

  exerciceAdded = [];
  exerciceAddLenght: number;

  /* formulaire */
  formulaire: FormGroup;
  exo: FormArray;
  part1 = true;
  part2 = false;
  nomIsEntered: boolean;
  typeIsChoose = false;
  disabled = true;
  disabled2 = false;
  nom = '';
  typeChoosen = '';
  displayEditForm = true;
  displayExercice = true;
  dataType = '';

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
    this.initForm();
  }





  /* FORMULAIRES */
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

  /*
  newExo(): FormGroup {
    return this.formBuilder.group({
      nbreReptSenior: ['', Validators.required],
      nbreSerie: ['', Validators.required],
      nbreTempsDeRepos: ['', Validators.required]
    });
  }*/
  newExoTest(): FormGroup {
    return this.formBuilder.group({
      nbreReptExercices: ['', Validators.required]
    });
  }
  newExoEchauf(): FormGroup {
    return this.formBuilder.group({
      nbreReptEchauf: ['', Validators.required]
    });
  }
  newExoCalme(): FormGroup {
    return this.formBuilder.group({
      nbreReptCalme: ['', Validators.required]
    });
  }
  newExoPatho(): FormGroup {
    return this.formBuilder.group({
      nbreReptPatho: ['', Validators.required]
    });
  }
  /*
  addExo() {
    this.getExo().push( this.newExo() );
    this.formOther = 1;
  }*/
  addExoTest() {
    this.getExo().push( this.newExoTest() );
    this.formTest = 1;
  }
  addExoEchauf() {
    this.getExo().push( this.newExoEchauf() );
    this.formTest = 1;
  }
  addExoCalme() {
    this.getExo().push( this.newExoCalme() );
    this.formTest = 1;
  }
  addExoPatho() {
    this.getExo().push( this.newExoPatho() );
    this.formTest = 1;
  }
  removeExo(i) {
    this.getExo().removeAt( i );
    if (this.getExo().length === 0) {
      this.formOther = this.formTest = 0;
    }
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
    this.typeChoosen = '';
    this.exos = false;
    this.exoTest = this.exoPatho = this.exoCalme = this.exoEchauf = false;
    this.typeIsChoose = false;
    this.displayEditForm = true;
    this.dataType = '';
    this.once = true;
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
    this.typeIsChoose = true;
    this.nomIsEntered = true;
    this.prepareEdit(id);
  }
  showPart() {
    this.part2 = true;
    this.part1 = false;
    this.nom = this.formulaire.get('nom').value;
    this.typeChoosen = this.formulaire.get('type').value;
    const type = this.formulaire.get('type').value;
    if ( type === 'test' ) {
      this.exoTest = true;
      this.exoCalme = this.exoEchauf = this.exoPatho = false;
      this.exos = false;
    } else if (type === 'calme') {
      this.exoCalme = true;
      this.exoTest = this.exoEchauf = this.exoPatho = false;
      console.log('ok2');
    } else if (type === 'echauffement') {
      this.exoEchauf = true;
      this.exoTest = this.exoCalme = this.exoPatho = false;
    } else {
      this.exoPatho = true;
      this.exoTest = this.exoCalme = this.exoEchauf = false;
    }

    if (this.isClickToEdit) {
      this.exerciceService.getSerieExerciceFromExercice(this.idToEdit);
      this.exerciceService.oneSerieFixeFromExerciceSubject.subscribe(data => {
        this.exerciceAdded = data.exercices;
        this.formulaire.patchValue({exercices: this.exerciceAdded});
        this.displayEditForm = true;
      });
    }
  }
  /*
  this.exerciceAdded = [];
  this.exos = true;
  this.exoTest = false;
  this.formulaire.setControl('exo', this.setControlDetailExo4());*/
  hidePart() {
    this.part1 = true;
    this.part2 = false;
  }

  setControlDetailExo(): FormArray {
    const formArray = new FormArray([], Validators.required);
    return formArray;
  }





  /* VERIFICATION && ACTIVATION DES BOUTONS */
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
  clickOnType() {
    const type = this.formulaire.get('type').value;
    this.typeIsChoose = true;

    if ( this.isClickToEdit ) {
      if ( this.dataType !== type ) {
        if (type === 'calme') {
          this.exoCalme = true;
          this.exoEchauf = this.exoPatho = this.exoTest = false;
          this.formulaire.setControl('exo', this.setControlDetailExo());
        } else if (type === 'echauffement') {
          console.log('ok echauf');
          this.exoEchauf = true;
          this.exoCalme = this.exoPatho = this.exoTest = false;
          this.formulaire.setControl('exo', this.setControlDetailExo());
        } else if (type === 'pathologies') {
          console.log('ok patho');
          this.exoPatho = true;
          this.exoCalme = this.exoEchauf = this.exoTest = false;
          this.formulaire.setControl('exo', this.setControlDetailExo());
        } else if (type === 'test') {
          console.log('ok test');
          this.exoTest = true;
          this.exoCalme = this.exoEchauf = this.exoPatho = false;
          this.formulaire.setControl('exo', this.setControlDetailExo());
        }
      }
    }

  }





  /* AFFICHAGE EXERCICE ET FILTRAGE */
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
    const type = this.formulaire.get('type').value;
    if (this.typeChoosen === 'test') {
      if ( this.isClickToEdit && this.once) {
        if (this.dataType !== type) {
          this.exerciceAdded = [];
          this.once = false;
        }
      }
      this.exoTest = true;
      this.exoEchauf = this.exoCalme = this.exoPatho = false;
      this.addExoTest();
      this.exerciceAdded.push( ex );
      this.exerciceAddLenght = this.exerciceAdded.length;
      this.formulaire.patchValue({
        exercices: ['', Validators.required]
      });
    } else if (this.typeChoosen === 'echauffement') {
      if ( this.isClickToEdit ) {
        if (  (this.dataType === 'test') && (type !== 'test') && this.once  ) {
          this.exerciceAdded = [];
          this.once = false;
        }
      }
      /*this.addExo();*/
      this.exoEchauf = true;
      this.exoTest = this.exoCalme = this.exoPatho = false;
      this.addExoEchauf();
      this.exerciceAdded.push( ex );
      this.exerciceAddLenght = this.exerciceAdded.length;
      this.formulaire.patchValue({
        exercices: ['', Validators.required]
      });
    } else if (this.typeChoosen === 'calme' ) {
      if ( this.isClickToEdit && this.once) {
        if (this.dataType !== type) {
          this.exerciceAdded = [];
          this.once = false;
        }
      }
      this.exoCalme = true;
      this.exoTest = this.exoEchauf = this.exoPatho = false;
      this.addExoCalme();
      this.exerciceAdded.push( ex );
      this.exerciceAddLenght = this.exerciceAdded.length;
      this.formulaire.patchValue({
        exercices: ['', Validators.required]
      });
    } else {
      if ( this.isClickToEdit && this.once) {
        if (this.dataType !== type) {
          this.exerciceAdded = [];
          this.once = false;
        }
      }
      this.exoPatho = true;
      this.exoTest = this.exoEchauf = this.exoCalme = false;
      this.addExoPatho();
      this.exerciceAdded.push( ex );
      this.exerciceAddLenght = this.exerciceAdded.length;
      this.formulaire.patchValue({
        exercices: ['', Validators.required]
      });
    }


    if ( this.exerciceAddLenght >= 1 ) {
      this.disabled2 = false;
    }
    this.disabled = true;
  }

  clearExo(i) {
    this.exerciceAdded.splice(i, 1);
    this.removeExo(i);
    this.exerciceAddLenght = this.exerciceAdded.length;
    if ( this.exerciceAddLenght === 0 ) {
      this.disabled2 = true;
      this.exerciceAdded = [];
    }
  }






  /* ADD EDIT DELETE */
  prepareEdit(id) {
    this.exerciceService.getOneSerieExercice(id);
    this.exerciceService.oneSerieExerciceFixeSubject.subscribe(data => {
      this.idToEdit = id;
      this.dataType = data.type;
      this.formulaire = this.formBuilder.group({
        nom: [data.nom, Validators.required],
        consigne: [data.consigne, Validators.required],
        senior: [data.senior, Validators.required],
        type: [data.type, Validators.required],
        pathology: [data.pathology, Validators.required],
        exo: this.formBuilder.array([], Validators.required),
        exercices: ['', Validators.required]
      });
      if (data.type === 'test') {
        this.formulaire.setControl('exo', this.setControlDetailExoTest(data.detailExos));
      } else if (data.type === 'echauffement') {
        this.formulaire.setControl('exo', this.setControlDetailExoEchauf(data.detailExos));
      } else if (data.type === 'calme' ) {
        this.formulaire.setControl('exo', this.setControlDetailExoCalme(data.detailExos));
      } else {
        this.formulaire.setControl('exo', this.setControlDetailExoPatho(data.detailExos));
      }
      this.displayExercice = true;
      this.nomIsEntered = true;
    });
    console.log( this.exerciceAdded );
  }
  /*setControlDetailExo1(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptSenior: [s.nbreReptSenior, Validators.required],
        nbreSerie: [s.nbreSerie, Validators.required],
        nbreTempsDeRepos: [s.nbreTempsDeRepos, Validators.required]
      }));
    });
    return formArray;
  }*/

  setControlDetailExoTest(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptExercices: [s.nbreReptExercices, Validators.required],
      }));
    });
    return formArray;
  }

  setControlDetailExoEchauf(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptEchauf: [s.nbreReptEchauf, Validators.required],
      }));
    });
    return formArray;
  }

  setControlDetailExoCalme(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptCalme: [s.nbreReptCalme, Validators.required],
      }));
    });
    return formArray;
  }

  setControlDetailExoPatho(data: any[]): FormArray {
    const formArray = new FormArray([], Validators.required);
    data.forEach(s => {
      formArray.push(this.formBuilder.group({
        nbreReptPatho: [s.nbreReptPatho, Validators.required],
      }));
    });
    return formArray;
  }


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
      data2.forEach(element => console.log( element.nom ));
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
