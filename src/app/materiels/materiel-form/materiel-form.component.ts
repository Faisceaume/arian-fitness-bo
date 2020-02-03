import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Materiel } from '../materiel';
import { FormControl } from '@angular/forms';
import { MaterielsService } from '../materiels.service';
import { Categorie } from 'src/app/shared/categories/categorie';
import { CategoriesService } from 'src/app/shared/categories/categories.service';

@Component({
  selector: 'app-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.css']
})
export class MaterielFormComponent implements OnInit {

  formData: Materiel;
  formDataCategorie: Categorie;
  categories: Categorie[];

  // toggle slide
  posteFixeControl = new FormControl();
  visibilityControl = new FormControl();

  constructor(private location: Location, private materielsService: MaterielsService,
              public categoriesService: CategoriesService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      postefixe: false,
      visibility: false,
      categories: []
    } as Materiel;

    this.formDataCategorie = {
      id: null,
      acronyme: '',
      nom: '',
      timestamp: ''
    } as Categorie;
  }


  onSubmit(): void {
    if (this.posteFixeControl.value) {
      this.formData.postefixe = this.posteFixeControl.value;
    }
    if (this.visibilityControl.value) {
      this.formData.visibility = this.visibilityControl.value;
    }
    this.materielsService.createMateriel(this.formData);
  }

  goBack(): void {
    this.location.back();
  }


}
