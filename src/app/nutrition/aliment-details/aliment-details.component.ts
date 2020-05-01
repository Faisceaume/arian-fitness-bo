import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { NutritionService } from '../nutrition.service';
import { FormControl } from '@angular/forms';
import { Aliment } from '../aliment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aliment-details',
  templateUrl: './aliment-details.component.html',
  styleUrls: ['./aliment-details.component.css']
})
export class AlimentDetailsComponent implements OnInit {

  formData: Aliment;
  valideControl = new FormControl();
  ratio: number;

  // validation
  proteinesStatut: string;
  glucidesStatut: string;
  lipidesStatut: string;
  fibresSoirStatut: string;
  fibresMidiStatut: string;
  collationStatut: string;
  agrementStatut: string;


  constructor(private nutritionService: NutritionService,
              private sharedService: SharedService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.nutritionService.getSingleAliment(id).then((item: Aliment) => {
        this.formData = item;
        this.initialisation();
        if (item.image) {
          this.sharedService.fileUrl = item.image;
        } else {
          this.sharedService.fileUrl = null;
        }

        if (item.omega3 && item.omega6) {
          const nb = item.omega6 / item.omega3;
          const res = Math.round(nb * 100) / 10;
          this.ratio = res;
        }

        this.sharedService.currentAliment = item;
        this.valideControl.setValue(item.valide);
        this.allVerification(item);
      });
    }
  }

  initialisation() {
   this.proteinesStatut =  this.formData.proteinesstatut;
   this.lipidesStatut =  this.formData.lipidesstatut;
   this.glucidesStatut =  this.formData.glucidesstatut;
   this.fibresSoirStatut =  this.formData.fibressoirstatut;
   this.fibresMidiStatut =  this.formData.fibresmidistatut;
   this.collationStatut = this.formData.collationstatut;
   this.agrementStatut = this.formData.agrementstatut;
  }

  updateFiel(attribut: string, value: any) {
    this.nutritionService.newUpdateVersion(this.formData, attribut, value);
    this.allVerification(this.formData);
    if (this.formData.omega3 && this.formData.omega6) {
      const nb = this.formData.omega6 / this.formData.omega3;
      const res = Math.round(nb * 100) / 10;
      this.ratio = res;
    }
  }

  updatemanuelle(attribut: string) {
    if (attribut === 'proteinesStatut') {
      if (this.formData.proteinesstatut === 'valide') {
        this.proteinesStatut = 'nonvalide';
        this.formData.proteinesstatut = 'nonvalide';
        this.updateFiel('proteinesstatut', 'nonvalide');
      } else {
        this.proteinesStatut = 'valide';
        this.formData.proteinesstatut = 'valide';
        this.updateFiel('proteinesstatut', 'valide');
      }
    } else if (attribut === 'glucidesStatut') {
      if (this.formData.glucidesstatut === 'valide') {
        this.glucidesStatut = 'nonvalide';
        this.formData.glucidesstatut = 'nonvalide';
        this.updateFiel('glucidesstatut', 'nonvalide');
      } else {
        this.glucidesStatut = 'valide';
        this.formData.glucidesstatut = 'valide';
        this.updateFiel('glucidesstatut', 'valide');
      }
    } else if (attribut === 'lipidesStatut') {
      if (this.formData.lipidesstatut === 'valide') {
        this.lipidesStatut = 'nonvalide';
        this.formData.lipidesstatut = 'nonvalide';
        this.updateFiel('lipidesstatut', 'nonvalide');
      } else {
        this.lipidesStatut = 'valide';
        this.formData.lipidesstatut = 'valide';
        this.updateFiel('lipidesstatut', 'valide');
      }
    } else if (attribut === 'fibresSoirStatut') {
      if (this.formData.fibressoirstatut === 'valide') {
        this.fibresSoirStatut = 'nonvalide';
        this.formData.fibressoirstatut = 'nonvalide';
        this.updateFiel('fibressoirstatut', 'nonvalide');
      } else {
        this.fibresSoirStatut = 'valide';
        this.formData.fibressoirstatut = 'valide';
        this.updateFiel('fibressoirstatut', 'valide');
      }
    } else if (attribut === 'fibresMidiStatut') {
      if (this.formData.fibresmidistatut === 'valide') {
        this.fibresMidiStatut = 'nonvalide';
        this.formData.fibresmidistatut = 'nonvalide';
        this.updateFiel('fibresmidistatut', 'nonvalide');
      } else {
        this.fibresMidiStatut = 'valide';
        this.formData.fibresmidistatut = 'valide';
        this.updateFiel('fibresmidistatut', 'valide');
      }
    } else if (attribut === 'collationStatut') {
      if (this.formData.collationstatut === 'valide') {
        this.collationStatut = 'nonvalide';
        this.formData.collationstatut = 'nonvalide';
        this.updateFiel('collationstatut', 'nonvalide');
      } else {
        this.collationStatut = 'valide';
        this.formData.collationstatut = 'valide';
        this.updateFiel('collationstatut', 'valide');
      }
    } else if (attribut === 'agrementStatut') {
      if (this.formData.agrementstatut === 'valide') {
        this.agrementStatut = 'nonvalide';
        this.formData.agrementstatut = 'nonvalide';
        this.updateFiel('agrementstatut', 'nonvalide');
      } else {
        this.agrementStatut = 'valide';
        this.formData.agrementstatut = 'valide';
        this.updateFiel('agrementstatut', 'valide');
      }
    }
  }


  // Methodes de vérification de validation protéines - glucides - lipides ...etc

  allVerification(item: Aliment) {
    if (this.formData.proteinesstatut === 'nonvalide') {
      this.verificationProteines(item);
    }
    if (this.formData.glucidesstatut === 'nonvalide') {
      this.verificationGlucides(item);
      console.log('enter');
    }
    if (this.formData.lipidesstatut === 'nonvalide') {
      this.verificationLipides(item);
    }
    if (this.formData.fibressoirstatut === 'nonvalide') {
      this.verificationFibresSoir(item);
    }
    if (this.formData.fibresmidistatut === 'nonvalide') {
      this.verificationFibresMidi(item);
    }
  }

  verificationProteines(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 12) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 0 && item.glucides <= 5) {
        if (item.glucidessimples <= 5 && item.glucidescomplexe <= 5 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides <= 20) {
      if (item.lipidessatures && item.lipidessatures <= 6) {
        //
        compt++;
      }
    }

    if (item.fibres) {
      //
      if (item.fibres > 0) {
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 80 && item.kcal <= 280) {
      //
      compt++;
    }

    if (compt === 5) {
      this.proteinesStatut = 'valide';
    } else {
      this.proteinesStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'proteinesstatut', this.proteinesStatut);
  }


  verificationGlucides(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 1) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 10 && item.glucides <= 60) {
        if (item.glucidessimples <= 5 && item.glucidescomplexe <= 60 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides <= 4) {
      if (item.lipidessatures && item.lipidessatures <= 4) {
        //
        compt++;
      }
    }

    if (item.fibres) {
      //
      if (item.fibres >= 1) {
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 100 && item.kcal <= 350) {
      //
      compt++;
    }

    if (compt === 5) {
      this.glucidesStatut = 'valide';
    } else {
      this.glucidesStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'glucidesstatut', this.glucidesStatut);
  }


  verificationLipides(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 0) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 0 && item.glucides <= 20) {
        if (item.glucidessimples <= 5 && item.glucidescomplexe <= 5 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides >= 15 && item.lipides <= 100) {
      if (item.lipidessatures && item.lipidessatures <= 20) {

        if (item.lipidesmonoinsatures && item.lipidesmonoinsatures <= 80) {

          if (item.lipidesmonopolyinsatures && item.lipidesmonopolyinsatures <= 80) {
              //
              compt++;
          }
        }
      }
    }

    if (item.omega3 && item.omega6) {
      const id = item.omega6 / item.omega3;
      if (id >= 3 && id <= 5) {
        //
        compt++;
      }
    }

    if (item.fibres) {
      //
      if (item.fibres >= 0) {
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 120 && item.kcal <= 900) {
      //
      compt++;
    }

    if (compt === 6) {
      this.lipidesStatut = 'valide';
    } else {
      this.lipidesStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'lipidesstatut', this.lipidesStatut);
  }

  verificationFibresSoir(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 1) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 0 && item.glucides <= 5) {
        if (item.glucidessimples <= 5 && item.glucidescomplexe <= 5 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides <= 0) {
      //
      compt++;
    }

    if (item.fibres) {
      if (item.fibres >= 1) {
        //
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 0 && item.kcal <= 30) {
      //
      compt++;
    }

    if (compt === 5) {
      this.fibresSoirStatut = 'valide';
    } else {
      this.fibresSoirStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'fibressoirstatut', this.fibresSoirStatut);
  }

  verificationFibresMidi(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 1) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 0 && item.glucides <= 10) {
        if (item.glucidessimples <= 5 && item.glucidescomplexe <= 10 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides <= 2) {
      //
      compt++;
    }

    if (item.fibres) {
      if (item.fibres >= 1) {
        //
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 0 && item.kcal <= 40) {
      //
      compt++;
    }

    if (compt === 5) {
      this.fibresMidiStatut = 'valide';
    } else {
      this.fibresMidiStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'fibresmidistatut', this.fibresMidiStatut);
  }

  /*
  verificationFibresGlucides(item: Aliment) {
    let compt = 0;
    if (item.proteines && item.proteines >= 12) {
      //
      compt++;
    }

    if (item.glucides && item.glucidessimples && item.glucidescomplexe) {
      if (item.glucides >= 10 && item.glucides <= 70) {
        if (item.glucidessimples <= 10 && item.glucidescomplexe <= 70 && item.lactoses <= 0) {
          //
          compt++;
        }
      }
    }

    if (item.lipides && item.lipides <= 6) {

      if (item.lipidessatures && item.lipidessatures <= 6) {
          //
          compt++;
      }
    }

    if (item.fibres) {
      if (item.fibres >= 2) {
        //
        compt++;
      }
    }

    if (item.kcal && item.kcal >= 100 && item.kcal <= 390) {
      //
      compt++;
    }

    if (compt === 5) {
      this.fibresGlucidesStatut = 'valide';
    } else {
      this.fibresGlucidesStatut = 'nonvalide';
    }
    this.nutritionService.newUpdateVersion(this.formData, 'fibresglucidesstatut', this.fibresMidiStatut);
  }
*/
}
