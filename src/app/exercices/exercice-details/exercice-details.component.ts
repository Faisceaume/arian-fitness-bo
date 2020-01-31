import { Component, OnInit } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MaterielsSharedComponent } from 'src/app/shared/materiels-shared/materiels-shared.component';
import { Materiel } from 'src/app/materiels/materiel';
import { Listes } from 'src/app/shared/listes';

@Component({
  selector: 'app-exercice-details',
  templateUrl: './exercice-details.component.html',
  styleUrls: ['./exercice-details.component.css']
})
export class ExerciceDetailsComponent implements OnInit {

  isLinear = false;
  formData: Exercice;
  niveaux: Niveau[];
  toChangeNiveau: boolean;
  // toggle slide
  echauffementControl = new FormControl();
  accessalledesportControl = new FormControl();


  // new section
  visibility = new FormControl();
  degressif = new FormControl();
  visuel = new FormControl();
  retouraucalme = new FormControl();
  listes: Listes;
  repetitionexercice = new FormControl();
  showSeniotRepetList: boolean;

  constructor(private route: ActivatedRoute,
              private exercicesService: ExercicesService,
              private niveauxService: NiveauxService,
              public materielsService: MaterielsService,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.listes = new Listes();
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then((item: Exercice) => {
      this.formData = item;
      this.materielsService.materielsSelected = this.formData.materiels;

      this.echauffementControl.setValue(item.echauffement);
      this.accessalledesportControl.setValue(item.accessalledesport);
      this.repetitionexercice.setValue(item.repetitionexercice);
      this.visibility.setValue(item.visibility);
      this.degressif.setValue(item.degressif);
      this.visuel.setValue(item.visuel);
      this.retouraucalme.setValue(item.retouraucalme);

      this.showSeniotRepetList = item.niveaumax.acronyme === 'S80+' ? true : false;

      this.niveauxService.getAllNiveaux();
      this.niveauxService.niveauxSubject.subscribe(data => {
          this.niveaux = data;
      });
  });
  }

  updateFiel(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
  }

  onDelete(materiel: Materiel) {
    this.materielsService.deleteMaterielSelected(materiel);
    this.exercicesService.newUpdateVersion(this.formData, 'materiels', this.materielsService.materielsSelected);
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = {currentMateriel: this.formData};
    this.matDialog.open(MaterielsSharedComponent, dialogConfig);
  }
}
