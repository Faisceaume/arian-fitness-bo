import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categorie } from '../categorie';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.css']
})
export class CategorieFormComponent implements OnInit {

  noeud: string;
  formData: Categorie;
  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.noeud = this.route.snapshot.params.noeud;
    this.formData = {
      id: null,
      nom: '',
      acro: null,
      timestamp: ''
    } as Categorie;
  }

  onSubmit() {
    this.categoriesService.createMateriel(this.formData, this.noeud);
  }

}
