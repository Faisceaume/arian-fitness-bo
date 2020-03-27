import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { AlimentsService } from './../aliments.service';
import { FormControl } from '@angular/forms';
import { Aliment } from './../aliment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aliment-details',
  templateUrl: './aliment-details.component.html',
  styleUrls: ['./aliment-details.component.css']
})
export class AlimentDetailsComponent implements OnInit {

  formData: Aliment;
  valideControl = new FormControl();

  constructor(private alimentsService: AlimentsService,
              private sharedService: SharedService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.alimentsService.getSingleAliment(id).then((item: Aliment) => {
        this.formData = item;
        if (item.source !== 'manuelle') {
          this.sharedService.showDeleteButton = true;
        }
        this.valideControl.setValue(item.valide);
        if (item.image) {
          this.sharedService.fileUrl = item.image;
        } else {
          this.sharedService.fileUrl = null;
        }
        this.sharedService.currentAliment = item;
      });
    }
  }

  updateFiel(attribut: string, value: any) {
    this.alimentsService.newUpdateVersion(this.formData, attribut, value);
  }

}
