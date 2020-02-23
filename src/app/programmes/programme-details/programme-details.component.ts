import { Component, OnInit } from '@angular/core';
import { ProgrammesService } from '../programmes.service';
import { ActivatedRoute } from '@angular/router';
import { Programme } from '../programme';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { FormControl } from '@angular/forms';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';

@Component({
  selector: 'app-programme-details',
  templateUrl: './programme-details.component.html',
  styleUrls: ['./programme-details.component.css']
})
export class ProgrammeDetailsComponent implements OnInit {

  formData: Programme;
  niveaux: Niveau[];
  toChangeNiveau: boolean;
  extraControl = new FormControl();
  custompointsfaiblesControl = new FormControl();
  showCustompointsfaibles: boolean;

  objectifsSelected: Objectif[];
  objectifsNotSelected: Objectif[] = [];
  objectifs: Objectif[];

  constructor(private programmesService: ProgrammesService,
              private route: ActivatedRoute,
              private niveauxService: NiveauxService,
              private objectifsService: ObjectifsService) { }

  ngOnInit() {

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    const id = this.route.snapshot.params.id;
    this.programmesService.getSingleProgramme(id).then((item: Programme) => {
      this.formData = item;
      this.extraControl.setValue(item.extra);
      this.custompointsfaiblesControl.setValue(item.custompointsfaibles);
      this.objectifsSelected = item.objectifs;
      if (item.niveau != null) {
        if (item.niveau.nombre > 1) {
          this.showCustompointsfaibles = true;
        } else {
          this.showCustompointsfaibles = false;
        }
      }
    }).then(() => {
      this.objectifs.forEach(item => {
        const index = this.objectifsSelected.findIndex(it => it.id === item.id);
        if (index < 0) {
          this.objectifsNotSelected.push(item);
        }
      });
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  onValueChange(attribut: string, value: any) {
    this.programmesService.newUpdateVersion(this.formData, attribut, value);
    if (attribut === 'niveau') {
      if (value.nombre > 1) {
        this.showCustompointsfaibles = true;
      } else {
        this.showCustompointsfaibles = false;
      }
    }
  }

  onObjectifSelected(event, item: Objectif) {
    if (event.checked) {
      this.objectifsSelected.push(item);
      const index = this.objectifsNotSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsNotSelected.splice(index, 1);
      }
    } else {
      this.objectifsNotSelected.push(item);
      const index = this.objectifsSelected.findIndex(it => it.id === item.id);
      if (index >= 0 ) {
        this.objectifsSelected.splice(index, 1);
      }
    }
    this.onValueChange('objectifs', this.objectifsSelected);
  }

}
