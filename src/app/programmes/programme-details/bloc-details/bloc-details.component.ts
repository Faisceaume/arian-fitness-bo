import { MethodesService } from './../../../methodes/methodes.service';
import { Niveau } from './../../../shared/niveaux/niveau';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Bloc } from '../../bloc';
import { Listes } from 'src/app/shared/listes';
import { Methode } from 'src/app/methodes/methode';
import { MethodeAvance } from '../../methode-avance';

@Component({
  selector: 'app-bloc-details',
  templateUrl: './bloc-details.component.html',
  styleUrls: ['./bloc-details.component.css']
})
export class BlocDetailsComponent implements OnInit {

  listeDuree = new Listes().dureemethodes;
  fusionnableControl = new FormControl();
  currentBloc: Bloc;
  niveau: Niveau;
  methodes: Methode[];

  constructor(public dialogRef: MatDialogRef<BlocDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private methodesService: MethodesService) { }

  ngOnInit() {
    this.currentBloc = new Bloc();
    this.niveau = this.data.niveau;
    this.methodes = this.methodesService
    .getMethodesForProgramme(this.niveau, this.currentBloc.orientation, this.currentBloc.duree);
    this.currentBloc.methodes = [];
  }

  updateField() {
    this.methodes = this.methodesService
    .getMethodesForProgramme(this.niveau, this.currentBloc.orientation, this.currentBloc.duree);

    this.formatClass();
  }

  formatClass() {
    const all = [];
    this.methodes.forEach(data => {
      const local = new MethodeAvance();
      local.acronyme = data.acronyme;
      local.id = data.id;
      local.nom = data.nom;
      all.push(Object.assign({}, local));
    });

    this.currentBloc.methodes = all;
  }

  deleteMethode(id: number) {
    this.methodes.splice(id, 1);
    this.formatClass();
  }

  updateBlocField(seance: number, bloc: number, attribut: string) {
  }

}
