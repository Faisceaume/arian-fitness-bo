import { SharedService } from './../../shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { Exercice } from '../exercice';
import { ActivatedRoute } from '@angular/router';
import { ExercicesService } from '../exercices.service';
import { FormControl } from '@angular/forms';
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
  niveauSelected: Niveau;
  toChangeNiveau = false;

  regimeSelected: string[]  = [];
  regimeNotSelected: string[] = [];
  allRegime = new Listes().listeRegimes;
  regimeUpdate: string[] = [];
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
              public sharedService: SharedService,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.listes = new Listes();
    const id = this.route.snapshot.params.id;
    this.exercicesService.getSingleExercice(id).then((item: Exercice) => {
      this.formData = item;
      this.niveauSelected = item.niveau ? item.niveau : null ;
      this.regimeSelected = item.regime;
      this.materielsService.materielsSelected = this.formData.materiels;

      this.echauffementControl.setValue(item.echauffement);
      this.accessalledesportControl.setValue(item.accessalledesport);
      this.repetitionexercice.setValue(item.repetitionexercice);
      this.visibility.setValue(item.visibility);
      this.degressif.setValue(item.degressif);
      this.visuel.setValue(item.visuel);
      this.retouraucalme.setValue(item.retouraucalme);

      this.sharedService.currentExercice = item;

      if (item.niveau) {
        this.showSeniotRepetList = item.niveau.acronyme === 'S80+' ? true  : false;
      }

      if (item.photo) {
        this.sharedService.isImageUploadShown = false;
        this.sharedService.fileUrl = item.photo;
      } else {
        this.sharedService.fileUrl = null;
        this.sharedService.isImageUploadShown = true;
      }

      if (item.video) {
        this.sharedService.isVideoUploadShown = false;
        this.sharedService.videoUrl = item.video;
      } else {
        this.sharedService.videoUrl = null;
        this.sharedService.isVideoUploadShown = true;
      }
  }).then(() => {
    this.allRegime.forEach(item => {
      const index = this.regimeSelected.indexOf(item);
      if (index < 0) {
        this.regimeNotSelected.push(item);
      }
    });
  });

    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
          this.niveaux = data;
      });
  }

  removeMateriel(materiel: Materiel): void {
    const list = this.materielsService.materielsSelected;
    const index = list.findIndex(item => item.id === materiel.id);
    if (index >= 0) {
      list.splice(index, 1);
    }
    this.exercicesService.newUpdateVersion(this.formData, 'materiels', list);
    this.materielsService.deleteExercice(materiel, this.formData);
  }

  updateFiel(attribut: string, value: any) {
    this.exercicesService.newUpdateVersion(this.formData, attribut, value);
    if (attribut === 'niveau') {
        this.showSeniotRepetList = value.acronyme === 'S80+' ? true : false;
    }
    this.formData.materiels.forEach(mat => {
      this.materielsService.writeExercice(mat, this.formData);
    });
  }

  onDelete(materiel: Materiel) {
    this.materielsService.deleteMaterielSelected(materiel);
    this.exercicesService.newUpdateVersion(this.formData, 'materiels', this.materielsService.materielsSelected);
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = {currentExercice: this.formData};
    this.matDialog.open(MaterielsSharedComponent, dialogConfig);
  }

  onUpdateRegime(event, item: string) {
    if (event.checked) {
      this.regimeSelected.push(item);
      const index = this.regimeNotSelected.indexOf(item);
      if (index >= 0) {
        this.regimeNotSelected.splice(index, 1);
      }

    } else {
      this.regimeNotSelected.push(item);
      const index = this.regimeSelected.indexOf(item);
      if (index >= 0) {
        this.regimeSelected.splice(index, 1);
      }
    }
    this.updateFiel('regime', this.regimeSelected);
  }

}
