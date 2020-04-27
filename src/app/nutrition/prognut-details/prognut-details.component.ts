import { Scenario } from './../scenario';
import { Listes } from './../../shared/listes';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { ObjectifsService } from './../../shared/objectifs/objectifs.service';
import { Prognut } from './../prognut';
import { ActivatedRoute } from '@angular/router';
import { NutritionService } from './../nutrition.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prognut-details',
  templateUrl: './prognut-details.component.html',
  styleUrls: ['./prognut-details.component.css']
})
export class PrognutDetailsComponent implements OnInit {

  formData: Prognut;
  objectifs: Objectif[];

  showObjectif: boolean;

  listeEtapes = new Listes().etapesprognut;
  listeNbreScenarios = new Listes().nbrescenarios;

  listeScenarios: Scenario[] = [];

  constructor(private nutritionService: NutritionService,
              private objectifsService: ObjectifsService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.objectifsService.getObjectifsPremium();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    const id = this.route.snapshot.params.id;
    this.nutritionService.getSingleProgNut(id).then((item: Prognut) => {
      this.formData = item;

      if (this.formData.listescenarios) {
        this.listeScenarios = item.listescenarios;
        this.formData.listescenarios.forEach(it => {
          it.addetape = false;
        });
      }

    });
  }

  selectObjectif(it: Objectif) {
    this.formData.objectif = it;
    this.updateField('objectif', this.formData.objectif);
    this.showObjectif = false;
  }

  updateField(attribut: string, value: any) {

    if (attribut === 'listescenarios') {
      this.formatClass();
    } else {
      this.nutritionService.updateProgNut(this.formData, attribut, value);

      if (attribut === 'nbrescenarios') {
        this.listeScenarios = [];
        for (let index = 0; index < value; index++) {
          this.listeScenarios[index] = new Scenario();
        }
        this.formatClass();
      }
    }
  }

  addEtape(scenario: number, item: string) {
    const index = this.listeScenarios[scenario].etapes.findIndex(it => it === item);
    if (index < 0) {
      this.listeScenarios[scenario].etapes.push(item);
    }
    this.formatClass();
  }

  deleteEtape(scenario: number, item: string) {
    const index = this.listeScenarios[scenario].etapes.findIndex(it => it === item);
    if (index >= 0) {
      this.listeScenarios[scenario].etapes.splice(index, 1);
    }
    this.formatClass();
  }

  formatClass() {
    const value = this.listeScenarios.map((obj) => {
      return Object.assign({}, obj);
    });
    this.nutritionService.updateProgNut(this.formData, 'listescenarios', value);
  }
/*
  deleteScenario(id: number) {
    if (confirm('confirmation de la suppression')) {
      this.listeScenarios.splice(id, 1);
      this.formatClass();
    }
  }
  */
}
