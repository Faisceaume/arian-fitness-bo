import { Component, OnInit } from '@angular/core';
import { ExercicesService } from '../exercices.service';
import { Exercice } from '../exercice';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrls: ['./exercice-form.component.css']
})
export class ExerciceFormComponent implements OnInit {

  formData: Exercice;
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();

  constructor(private exercicesService: ExercicesService) { }

  ngOnInit() {
    this.initFormData();
  }


  initFormData() {
    this.formData = {
          id: null,
          numero: '',
          nom: '',
          type: '',
          descriptif: '',
          niveau: null,
          duree: 0,
          position: '',

          ageminimal: 0,
          agemaximal: 0,
          echauffement: false,
          nbrerepetitionechauffement: 0,
          nbrrepetitionsenior: 0,
          accessalledesport: false,

          regime: '',
          consigne: '',
          timestamp: 0
    } as Exercice;
  }

  onSubmit(): void {
    if (this.echauffementControl.value) {
      this.formData.echauffement = this.echauffementControl.value;
    }
    if (this.accessalledesportControl.value) {
      this.formData.accessalledesport = this.accessalledesportControl.value;
    }
    this.exercicesService.createExercice(this.formData);
  }
}
