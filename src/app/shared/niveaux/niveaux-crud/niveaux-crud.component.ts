import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Niveau } from '../niveau';
import { NiveauxService } from '../niveaux.service';

@Component({
  selector: 'app-niveaux-crud',
  templateUrl: './niveaux-crud.component.html',
  styleUrls: ['./niveaux-crud.component.css']
})
export class NiveauxCrudComponent implements OnInit {

  formData: Niveau;
  toCreate: boolean;

  constructor(public dialogRef: MatDialogRef<NiveauxCrudComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private niveauxService: NiveauxService) { }

  ngOnInit() {
    if (this.data) {
      this.formData = this.data;
    } else {
      this.formData = {
        id: null,
        nom: '',
        nombre: 0,
        nbrsemaine: 0,
        nbrsemainemodereprise: '',
        timestamp: 0
      } as Niveau;

      this.toCreate = true;
    }
  }

  onSubmit() {
    this.niveauxService.createNiveaux(this.formData);
    this.closeDialog();
  }

  updateField(attribut: string, value: any) {
    if (this.formData.id) {
      this.niveauxService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  onChangeValue(ob) {
    this.formData.nbrsemainemodereprise = ob.value;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
