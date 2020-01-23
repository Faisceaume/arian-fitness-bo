import { Component, OnInit } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit {

  formData: Exercice;
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then((item: Exercice) => {
      this.formData = item;
      this.echauffementControl.setValue(item.echauffement);
      this.accessalledesportControl.setValue(item.accessalledesport);
    });
  }

  updateFiel(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
  }

}
