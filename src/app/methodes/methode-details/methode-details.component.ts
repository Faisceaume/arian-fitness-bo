import { Component, OnInit } from '@angular/core';
import { Methode } from '../methode';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { FormControl } from '@angular/forms';
import { Listes } from 'src/app/shared/listes';
import { ActivatedRoute } from '@angular/router';
import { MethodesService } from '../methodes.service';

@Component({
  selector: 'app-methode-details',
  templateUrl: './methode-details.component.html',
  styleUrls: ['./methode-details.component.css']
})
export class MethodeDetailsComponent implements OnInit {

  listes: Listes;
  niveaux: Niveau[];
  formData: Methode;
  isLinear = false;
  seniorControl = new FormControl();
  ordreexercicemodifiableControl = new FormControl();
  globalControl = new FormControl();
  toChangeNiveau: boolean;

  constructor(private niveauxService: NiveauxService,
              private route: ActivatedRoute,
              private methodesService: MethodesService) { }

  ngOnInit() {
    this.listes = new Listes();
    const id = this.route.snapshot.params.id;
    this.methodesService.getSingleMethode(id).then(item => {
      this.formData = item;
      this.seniorControl.setValue(item.senior);
      this.ordreexercicemodifiableControl.setValue(item.ordreexercicemodifiable);
      this.globalControl.setValue(item.global);
    });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
  }

  onValueChange(attribut: string, value: any) {
    this.methodesService.newUpdateVersion(this.formData, attribut, value);
  }

}
