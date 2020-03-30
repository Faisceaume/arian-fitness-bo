import { Router } from '@angular/router';
import { Aliment } from './../aliment';
import { Component, OnInit } from '@angular/core';
import { AlimentsService } from '../aliments.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  nomAliment: string;
  itemSelected: any;

  constructor(public alimentsService: AlimentsService,
              private router: Router) { }

  ngOnInit() {
  }

  onSearch() {
    this.alimentsService.getAlimentForApi(this.nomAliment);
  }

  selected(item: any) {
    this.itemSelected = item;
  }

  saveAliment() {
    const local = new Aliment();
    local.nom = this.itemSelected.product_name_fr;
    local.proteines = this.itemSelected.nutriments.proteins_100g ?
                      this.itemSelected.nutriments.proteins_100g : 0;
    local.glucides = this.itemSelected.nutriments.carbohydrates_100g ?
                     this.itemSelected.nutriments.carbohydrates_100g : 0;
    local.glucidessimples = this.itemSelected.nutriments.sugars ?
                            this.itemSelected.nutriments.sugars : 0;
    const nb = local.glucides - local.glucidessimples;
    const res = Math.round(nb * 100) / 100;
    local.glucidescomplexe = res;
    local.lipides = this.itemSelected.nutriments.fat_100g ? this.itemSelected.nutriments.fat_100g : 0;
    local.lipidessatures = this.itemSelected.nutriments['saturated-fat'] ?
                            this.itemSelected.nutriments['saturated-fat'] : 0;
    local.fibres = this.itemSelected.nutriments.fiber ? this.itemSelected.nutriments.fiber : 0;
    local.kcal = this.itemSelected.nutriments.energy ? this.itemSelected.nutriments.energy : 0;
    local.sodium = this.itemSelected.nutriments.sodium ? this.itemSelected.nutriments.sodium : 0;
    local.sel = this.itemSelected.nutriments.salt ? this.itemSelected.nutriments.salt : 0;
    local.source = 'open food fact';
    local.image = this.itemSelected.image_url;
    const value = Object.assign({}, local);
    this.alimentsService.createAliment(value);
  }
}
