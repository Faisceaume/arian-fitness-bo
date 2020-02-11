import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Categorie } from './categorie';
import { CategoriesService } from './categories.service';
import { Materiel } from 'src/app/materiels/materiel';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { Exercice } from 'src/app/exercices/exercice';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CategoriesCrudComponent } from './categories-crud/categories-crud.component';
import { Pathologie } from '../pathologies/pathologie';
import { PathologiesService } from '../pathologies/pathologies.service';


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
  @Input() currentPathologie: Pathologie;


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
              private pathologiesService: PathologiesService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    if (this.noeud) {
      this.categoriesService.getAllCategories(this.noeud);
    } else {
      this.categoriesService.getAllCategories('exe_cat');
    }
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
    if (this.currentExercice) {
      this.categoriesService.addElementToSubCollection(item, this.currentExercice, 'exe_cat');
    } else if (this.currentMateriel) {
      this.categoriesService.addElementToSubCollection(item, this.currentMateriel, 'mat_cat');
    }
  }

  deleteChip(item: Categorie) {
    const index = this.chipsSelected.findIndex(it => it.id === item.id);
    if (index >= 0) {
      this.chipsSelected.splice(index, 1);
    }

    if (this.currentExercice) {
      this.categoriesService.removeElementToSubCollection(item, this.currentExercice, 'exe_cat');
    } else if (this.currentMateriel) {
      this.categoriesService.removeElementToSubCollection(item, this.currentMateriel, 'mat_cat');
    } else if (this.currentPathologie) {
      this.noeud === 'exe_cat' ? this.pathologiesService.newUpdateVersion(this.currentPathologie,
        'exercicesCategorie', this.chipsSelected) :
        this.pathologiesService.newUpdateVersion(this.currentPathologie,
          'materielsCategorie', this.chipsSelected);
    }
  }

  selectMe(item: Categorie) {
        if (item.selected) {
          item.selected = false;
          this.deleteChip(item);

          if (this.categoriesService.index >= 0) {
            // this.categoriesService.listeOfSeries[this.categoriesService.index].categories = this.chipsSelected;
            this.categoriesService.removeCategorieOnListe(item);
          }

          // Operation for Pathologies Section
          this.noeud === 'exe_cat' ? this.categoriesService.removeExeCatChipsSelected(item) :
           this.categoriesService.removeMatCatChipsSelected(item);
          if (this.currentPathologie) {
            this.pathologiesService.deletePathologieidOnTable(item, this.currentPathologie, this.noeud);
          }
        } else {
          item.selected = true;
          this.addChip(item);
          if (this.categoriesService.index >= 0) {
            // this.categoriesService.listeOfSeries[this.categoriesService.index].categories = this.chipsSelected;
            this.categoriesService.pushCategorieOnListe(item);
          }

          // Operation for Pathologies Section
          this.noeud === 'exe_cat' ? this.categoriesService.addChipsForExeCatChipsSelected(item) :
           this.categoriesService.addChipsForMatCatChipsSelected(item);
          if (this.currentPathologie) {
            this.pathologiesService.addPathologieidOnTable(item, this.currentPathologie, this.noeud);
          }
        }

        if (this.currentMateriel) {
          this.materielsService.newUpdateVersion(this.currentMateriel, 'categories', this.chipsSelected);
        } else if (this.currentExercice) {
          this.exercicesService.newUpdateVersion(this.currentExercice, 'categories', this.chipsSelected);
        } else if (this.currentPathologie) {
          this.noeud === 'exe_cat' ?
            this.pathologiesService.newUpdateVersion(this.currentPathologie, 'exercicesCategorie',
              this.chipsSelected) :
            this.pathologiesService.newUpdateVersion(this.currentPathologie, 'materielsCategorie',
              this.chipsSelected);
        }
        this.categoriesService.setChipsSelectedForOperationValue(this.chipsSelected);
  }

  openMatDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    if (this.noeud) {
      dialogConfig.data = this.noeud;
    } else {
      dialogConfig.data = 'exe_cat';
    }

    this.matDialog.open(CategoriesCrudComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.chipsSelectedInput = null;
    this.currentMateriel = null;
    this.currentExercice = null;
    this.currentPathologie = null;
  }

}
