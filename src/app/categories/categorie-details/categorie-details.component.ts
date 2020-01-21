import { Component, OnInit } from '@angular/core';
import { Categorie } from '../categorie';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-categorie-details',
  templateUrl: './categorie-details.component.html',
  styleUrls: ['./categorie-details.component.css']
})
export class CategorieDetailsComponent implements OnInit {

  noeud: string;
  formData: Categorie;

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.noeud = this.route.snapshot.params.noeud;
    const id = this.route.snapshot.params.id;
    this.categoriesService.getSingleCategorie(id, this.noeud).then(
      (item: Categorie) => {
        this.formData = item;
      }
    );
  }

  onChangeValue(attribut: string, value: any) {
    this.categoriesService.newUpdateVersion(this.formData, attribut, value, this.noeud);
  }

}
