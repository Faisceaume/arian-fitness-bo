import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Materiel } from '../materiel';
import { MaterielsService } from '../materiels.service';
import { Categorie } from 'src/app/categories/categorie';
import { CategoriesService } from 'src/app/categories/categories.service';

@Component({
  selector: 'app-materiel-details',
  templateUrl: './materiel-details.component.html',
  styleUrls: ['./materiel-details.component.css']
})
export class MaterielDetailsComponent implements OnInit {
  formData: Materiel;
  categories: Categorie[];
  chipsSelected: string[];

    // toggle slide
    posteFixeControl = new FormControl();
    visibilityControl = new FormControl();

  constructor(private route: ActivatedRoute,
              private materielsService: MaterielsService,
              private router: Router,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.materielsService.getSingleMateriel(id).then(
      (item: Materiel) => {
        this.formData = item;
        this.posteFixeControl.setValue(item.postefixe);
        this.visibilityControl.setValue(item.visibility);
        this.chipsSelected = this.formData.categories;
      }
    ).then(() => {
      this.getAllCategorie();
    });
  }

  getAllCategorie() {
    this.categoriesService.getAllCategories('mat_cat');
    this.categoriesService.categorieSubject.subscribe(data => {
                  this.categories = data;
                  this.categories.forEach((item, index) => {
                    if (this.chipsSelected.indexOf(item.nom) >= 0) {
                      this.categories[index].selected = true;
                    }
                  });
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
    this.onValueChange('categories', this.chipsSelected);
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

  onValueChange(attribut: string, value: any) {
    this.materielsService.newUpdateVersion(this.formData, attribut, value);
  }

}
