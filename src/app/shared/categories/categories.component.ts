import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Categorie } from './categorie';
import { CategoriesService } from './categories.service';
import { Materiel } from 'src/app/materiels/materiel';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { Exercice } from 'src/app/exercices/exercice';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriesCrudComponent } from './categories-crud/categories-crud.component';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {


  @Input() noeud: string;
  @Input() chipsSelectedInput?: any;
  @Input() currentMateriel: Materiel;
  @Input() currentExercice: Exercice;


  chipsSelected: Categorie[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  categories: Categorie[] = [];

  toCreate: boolean;
  formData: Categorie;

  constructor(private categoriesService: CategoriesService,
              private materielsService: MaterielsService,
              private exercicesService: ExercicesService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.categoriesService.getAllCategories(this.noeud);
    this.categoriesService.categorieSubject.subscribe(data => {
      this.categories = data;
      if (this.chipsSelectedInput) {
        this.chipsSelected = this.chipsSelectedInput;
        this.categories.forEach((item: Categorie, index) => {
          if (this.chipsSelectedInput.find(it => it.id === item.id)) {
            this.categories[index].selected = true;
          }
        });
      }
    });

  }

  addChip(item: Categorie) {
    this.chipsSelected.push(item);
  }

  deleteChip(item: Categorie) {
    const index = this.chipsSelected.findIndex(it => it.id === item.id);
    if (index >= 0) {
      this.chipsSelected.splice(index, 1);
    }
  }

  selectMe(item: Categorie) {
        if (item.selected) {
          item.selected = false;
          this.deleteChip(item);
        } else {
          item.selected = true;
          this.addChip(item);
        }

        if (this.currentMateriel) {
          this.materielsService.newUpdateVersion(this.currentMateriel, 'categories', this.chipsSelected);
        } else if (this.currentExercice) {
          this.exercicesService.newUpdateVersion(this.currentExercice, 'categories', this.chipsSelected);
        }
        this.categoriesService.setChipsSelectedForOperationValue(this.chipsSelected);
  }

  openMatDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = this.noeud;
    this.matDialog.open(CategoriesCrudComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.chipsSelectedInput = null;
    this.currentMateriel = null;
    this.currentExercice = null;
  }

}
