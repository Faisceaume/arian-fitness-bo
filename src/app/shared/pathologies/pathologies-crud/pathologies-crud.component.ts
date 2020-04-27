import { ExerciceSerieAvance } from './../../../programmes/exercice-serie-avance';
import { ExercicesSeriesService } from './../../../exercices-series/exercices-series.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Pathologie } from '../pathologie';
import { PathologiesService } from '../pathologies.service';
import { CategoriesService } from '../../categories/categories.service';
import { ExerciceSerie } from 'src/app/exercices-series/exercice-serie';

@Component({
  selector: 'app-pathologies-crud',
  templateUrl: './pathologies-crud.component.html',
  styleUrls: ['./pathologies-crud.component.css']
})
export class PathologiesCrudComponent implements OnInit {

  formData: Pathologie;
  serieFixePathologie: ExerciceSerie[];
  toCreate: boolean;
  toMatCatManager: boolean;
  toExeCatManager: boolean;
  toAddSerieFixe: boolean;

  constructor(public dialogRef: MatDialogRef<PathologiesCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pathologiesService: PathologiesService,
              private exercicesSerieService: ExercicesSeriesService,
              public categoriesService: CategoriesService) { }

  ngOnInit() {
    if (this.data) {
      this.formData = this.data;
    } else {
      this.formData = {
        id: null,
        nom: '',
        acronyme: '',
        details: '',
        timestamp: 0
      } as Pathologie;

      this.toCreate = true;
    }

    this.exercicesSerieService.getAllSeriesExercicesByType('pathologies');
    this.exercicesSerieService.serieExerciceFixeByTypeSubject.subscribe(data => {
      this.serieFixePathologie = data;
    });
  }

  selectSerieFixe(item: ExerciceSerie) {
    const local = new ExerciceSerieAvance();
    local.id = item.id;
    local.nom = item.nom;
    local.senior = item.senior;

    this.formData.seriefixe = local;
    this.updateField('seriefixe', Object.assign({}, this.formData.seriefixe));
    this.toAddSerieFixe = false;
  }

  onSubmit() {
    this.formData.exercicesCategorie = this.categoriesService.exeCatChipsSelected;
    this.formData.materielsCategorie = this.categoriesService.matCatChipsSelected;
    this.pathologiesService.createPathologie(this.formData);
    this.categoriesService.resetChipsSelectedElement();
    this.closeDialog();
  }

  updateField(attribut: string, value: any) {
    if (this.formData.id) {
      this.pathologiesService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
