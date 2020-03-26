import { AlimentsService } from './../aliments.service';
import { Aliment } from './../aliment';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aliment-form',
  templateUrl: './aliment-form.component.html',
  styleUrls: ['./aliment-form.component.css']
})
export class AlimentFormComponent implements OnInit {

  formData: Aliment;

  constructor(public dialogRef: MatDialogRef<AlimentFormComponent>,
              private alimentsService: AlimentsService) { }

  ngOnInit() {
    this.formData = {
      id: null,
      nom: '',
      proteines: null,
      glucides: null,
      glucidessimples: null,
      glucidescomplexe: null,
      lactoses: null,
      lipides: null,
      lipidessatures: null,
      lipidesmonoinsatures: null,
      lipidesmonopolyinsatures: null,
      omega3: null,
      omega6: null,
      fibres: null,
      kcal: null,
      valide: false,
      ig: null, // (indice glycémique) (entre 0 et 100)
      sodium: null,
      sel: null,
      image: null,
      timestamp: 0,
      source: 'manuelle' // (manuelle / Opend food fact)
    };
  }

  onSave() {
    this.alimentsService.createAliment(this.formData);
    this.dialogRef.close();
  }
}
