import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Materiel } from '../materiel';
import { FormControl } from '@angular/forms';
import { MaterielsService } from '../materiels.service';
import { Categorie } from 'src/app/categories/categorie';
import { CategoriesService } from 'src/app/categories/categories.service';

@Component({
  selector: 'app-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.css']
})
export class MaterielFormComponent implements OnInit {

  formData: Materiel;
  categories: Categorie[];
  chipsSelected: string[] = [];

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

    this.categoriesService.getAllCategories('mat_cat');
    this.categoriesService.categorieSubject.subscribe(data => {
      this.categories = data;
    });
  }

  selectMe(event: any) {
    if (event.selected) {
      event.selected = false;
      this.removeChips(event as Categorie);
    } else {
      event.selected = true;
      this.addChips(event as Categorie);
    }
  }

  addChips(item: Categorie) {
    this.chipsSelected.push(item.nom);
  }

  removeChips(item: Categorie) {
    const index = this.chipsSelected.indexOf(item.nom);
    if (index >= 0) {
      this.chipsSelected.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.posteFixeControl.value) {
      this.formData.postefixe = this.posteFixeControl.value;
    }
    if (this.visibilityControl.value) {
      this.formData.visibility = this.visibilityControl.value;
    }
    this.formData.categories = this.chipsSelected;
    this.materielsService.createMateriel(this.formData);
  }

}
