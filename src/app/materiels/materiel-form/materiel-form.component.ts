import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Materiel } from '../materiel';
import { FormControl } from '@angular/forms';
import { MaterielsService } from '../materiels.service';
import { Categorie } from 'src/app/shared/categories-section/categorie';
import { CategoriesService } from 'src/app/shared/categories-section/categories.service';

@Component({
  selector: 'app-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.css']
})
export class MaterielFormComponent implements OnInit {

  formData: Materiel;
  categories: Categorie[];

  // toggle slide
  posteFixeControl = new FormControl();
  visibilityControl = new FormControl();

  constructor(private materielsService: MaterielsService,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      postefixe: false,
      visibility: false,
      categories: []
    } as Materiel;
  }


  onSubmit(): void {
    if (this.posteFixeControl.value) {
      this.formData.postefixe = this.posteFixeControl.value;
    }
    if (this.visibilityControl.value) {
      this.formData.visibility = this.visibilityControl.value;
    }
    this.formData.categories = this.categoriesService.chipsSelectedForOperation;
    this.materielsService.createMateriel(this.formData);
  }

}
