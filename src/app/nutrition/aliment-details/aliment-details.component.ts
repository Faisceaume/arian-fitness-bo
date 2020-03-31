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
  fibresGlucidesStatut: string;


  constructor(private nutritionService: NutritionService,
              private sharedService: SharedService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.nutritionService.getSingleAliment(id).then((item: Aliment) => {
        this.formData = item;

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

  updateFiel(attribut: string, value: any) {
    this.nutritionService.newUpdateVersion(this.formData, attribut, value);
    this.allVerification(this.formData);
    this.allUpdate();
    if (this.formData.omega3 && this.formData.omega6) {
      const nb = this.formData.omega6 / this.formData.omega3;
      const res = Math.round(nb * 100) / 10;
      this.ratio = res;
    }
  }


  // Methodes de vérification de validation protéines - glucides - lipides ...etc

  allVerification(item: Aliment) {
    this.verificationProteines(item);
    this.verificationGlucides(item);
    this.verificationLipides(item);
    this.verificationFibresSoir(item);
    this.verificationFibresMidi(item);
    this.verificationFibresGlucides(item);
  }

  allUpdate() {
    this.nutritionService.newUpdateVersion(this.formData, 'proteinesstatut', this.proteinesStatut);
    this.nutritionService.newUpdateVersion(this.formData, 'glucidesstatut', this.glucidesStatut);
    this.nutritionService.newUpdateVersion(this.formData, 'lipidesstatut', this.lipidesStatut);
    this.nutritionService.newUpdateVersion(this.formData, 'fibressoirstatut', this.fibresSoirStatut);
    this.nutritionService.newUpdateVersion(this.formData, 'fibresmidistatut', this.fibresMidiStatut);
    this.nutritionService.newUpdateVersion(this.formData, 'fibresglucidesstatut', this.fibresMidiStatut);
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
  }


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
  }
}
