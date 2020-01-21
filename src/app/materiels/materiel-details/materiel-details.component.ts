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

    formData: Materiel;
    // toggle slide
    posteFixeControl = new FormControl();
    visibilityControl = new FormControl();

  constructor(private route: ActivatedRoute,
              private materielsService: MaterielsService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.materielsService.getSingleMateriel(id).then(
      (item: Materiel) => {
        this.formData = item;
        this.posteFixeControl.setValue(item.postefixe);
        this.visibilityControl.setValue(item.visibility);
      });
  }

  onValueChange(attribut: string, value: any) {
    this.materielsService.newUpdateVersion(this.formData, attribut, value);
  }

}
