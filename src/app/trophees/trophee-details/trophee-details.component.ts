import { Component, OnInit } from '@angular/core';
import { TropheesService } from '../trophees.service';
import { ActivatedRoute } from '@angular/router';
import { Trophee } from '../trophee';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-trophee-details',
  templateUrl: './trophee-details.component.html',
  styleUrls: ['./trophee-details.component.css']
})
export class TropheeDetailsComponent implements OnInit {

  formData: Trophee;

  constructor(
    private tropheesService: TropheesService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.tropheesService.getOneTrophee(id);
    this.tropheesService.tropheeSubject.subscribe(data => {
      this.formData = data;
      if (data.image) {
        this.sharedService.fileUrl = data.image;
      } else {
        this.sharedService.fileUrl = null;
      }
      this.sharedService.currentTrophee = data;
    });
  }

  updateField(champ, valeurChamp) {
    const id = this.route.snapshot.paramMap.get('id');
    this.tropheesService.updateField(champ, valeurChamp, id);
  }

}
