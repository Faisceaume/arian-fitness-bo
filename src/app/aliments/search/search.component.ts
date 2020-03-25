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

  constructor(public alimentsService: AlimentsService) { }

  ngOnInit() {
  }

  onSearch() {
    this.alimentsService.getAlimentForApi(this.nomAliment);
  }

  selected(item: any) {
    this.itemSelected = item;
  }
}
