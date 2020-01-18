import { Component, OnInit } from '@angular/core';
import { Materiel } from '../materiel';
import { FormControl, NgForm } from '@angular/forms';
import { MaterielsService } from '../materiels.service';

@Component({
  selector: 'app-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.css']
})
export class MaterielFormComponent implements OnInit {

  toppings = new FormControl();
  formData: Materiel;

  categories: string[] = ['salledesport', 'machines', 'bancs', 'petitmateriel', 'nomateriel'];

  constructor(private materielsService: MaterielsService) { }

  ngOnInit() {
    this.formData = {
      id : null,
      nom : '',
      timestamp: '',
      postefixe: false,
      visibility: false,
      categories: []
    } as Materiel;
  }

  onSubmit(): void {
    this.formData.categories = this.toppings.value;
    this.materielsService.createMateriel(this.formData);
  }

}
