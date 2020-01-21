import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { Categorie } from 'src/app/shared/categories-section/categorie';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit, OnDestroy {

  formData: Exercice;
  categories: Categorie[];

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private router: Router) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then( (item: Exercice) => {
          this.formData = item;
     } );
  }

  onValueChange(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
  }

  ngOnDestroy(): void {
  }

}
