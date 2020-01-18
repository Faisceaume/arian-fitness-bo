import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Materiel } from '../materiel';
import { MaterielsService } from '../materiels.service';

@Component({
  selector: 'app-materiel-details',
  templateUrl: './materiel-details.component.html',
  styleUrls: ['./materiel-details.component.css']
})
export class MaterielDetailsComponent implements OnInit {

  toppings = new FormControl();
  formData: Materiel;

  categories: string[] = ['salledesport', 'machines', 'bancs', 'petitmateriel', 'nomateriel'];

  constructor(private route: ActivatedRoute,
              private materielsService: MaterielsService,
              private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.materielsService.getSingleMateriel(id).then(
      (item: Materiel) => {
        this.formData = item;
        this.toppings.setValue(this.formData.categories);
      }
    );
  }

  onSubmit() {
    this.formData.categories = this.toppings.value;
    this.materielsService.updateMaterial(this.formData);
    this.router.navigate(['materiels']);
  }

}
