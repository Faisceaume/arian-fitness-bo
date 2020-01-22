import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Categorie } from '../categorie';
import { CategoriesService } from '../categories.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories-crud',
  templateUrl: './categories-crud.component.html',
  styleUrls: ['./categories-crud.component.css']
})
export class CategoriesCrudComponent implements OnInit {

  formDataCategorie: Categorie;
  toCreate: boolean;
  toEdit: boolean;
  categories: any;

  constructor(private categoriesService: CategoriesService,
              public dialogRef: MatDialogRef<CategoriesCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.categoriesService.getAllCategories(this.data);
    this.categoriesService.categorieSubject.subscribe(data => {
      this.categories = data;
    });
    this.initFormData();
  }

  initFormData() {
    this.formDataCategorie = {
      id: null,
      nom: '',
      acronyme: '',
      timestamp: ''
    } as Categorie;
  }

  onEdit(categorie: Categorie) {
    this.formDataCategorie = categorie;
    this.toCreate = false;
    this.toEdit = true;
  }

  onCreate() {
    this.toCreate = true;
    this.initFormData();
    this.toEdit = false;
  }

  onSubmit2(form: NgForm) {
    this.categoriesService.createCategorie(this.formDataCategorie, this.data);
    this.toCreate = false;
  }

  updateField(attribut: string, value: any) {
    if (this.formDataCategorie.id) {
      this.categoriesService.newUpdateVersion(this.formDataCategorie, attribut, value, this.data)
    }
  }

  onDelete(categorie: Categorie) {
    if (confirm('Confirmer la suppression ?')) {
      this.categoriesService.deleteCategorie(categorie, this.data);
    }
  }

}
