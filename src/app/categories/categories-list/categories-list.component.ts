import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { Categorie } from '../categorie';
import { CategoriesService } from '../categories.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  noeud: string;
  categories: Categorie[];
  categoriesSubscription: Subscription;
  displayedColumns: string[] = ['date', 'nom', 'acro', 'action'];
  dataSource: MatTableDataSource<Categorie>;


  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.noeud = this.route.snapshot.params.noeud;
    this.categoriesService.getAllCategories(this.noeud);
    this.categoriesSubscription = this.categoriesService.categorieSubject.subscribe(data => {
      this.categories = data;
      this.dataSource = new MatTableDataSource<Categorie>(data);
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(categorie: Categorie) {
    if (confirm('vraiment supprimer ?')) {
      this.categoriesService.deleteCategorie(categorie, this.noeud);
    }
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

}
