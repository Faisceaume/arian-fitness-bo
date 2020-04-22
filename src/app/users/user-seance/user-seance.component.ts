import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { Pathologie } from './../../shared/pathologies/pathologie';
import { ExerciceSerie } from './../../exercices-series/exercice-serie';
import { ExercicesSeriesService } from './../../exercices-series/exercices-series.service';
import { Seance } from './../../programmes/seance';
import { Programme } from './../../programmes/programme';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ProgrammesService } from 'src/app/programmes/programmes.service';
import { ExercicesService } from 'src/app/exercices/exercices.service';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { Exercice } from 'src/app/exercices/exercice';
import { CategoriesService } from 'src/app/shared/categories/categories.service';
import { MaterielsService } from 'src/app/materiels/materiels.service';
import { MethodesService } from 'src/app/methodes/methodes.service';
import { Methode } from 'src/app/methodes/methode';
import { Observable, of, concat } from 'rxjs';
import { Bloc } from 'src/app/programmes/bloc';
import { Series } from 'src/app/shared/series';
import { Categorie } from 'src/app/shared/categories/categorie';

@Component({
  selector: 'app-user-seance',
  templateUrl: './user-seance.component.html',
  styleUrls: ['./user-seance.component.css']
})
export class UserSeanceComponent implements OnInit {

  currentUser: User;
  programmes: Programme;
  seance: Seance;
  senior: string;
  echauffement: ExerciceSerie;
  pathologie: PathologieAvance;
  currentPathologie: Pathologie;
  lancementSerieFixePathos: boolean;
  isPathologie: boolean;

  niveaux: Niveau[];
  listeNiveau: Niveau[] = [];

  listeExercices: Exercice[] = [];
  listeCategories: Categorie[];

  methodesCorrespondantes: Methode[];
  heuredepointe = 'oui';

  currentBloc: Bloc;
  methodeAleatoire: Methode;
  methodeAleatoireCatExe: Categorie[] = [];
  methodeWorks: boolean;

  errorMessage = [];

  constructor(private usersService: UsersService,
              private exercicesService: ExercicesService,
              private programmesService: ProgrammesService,
              private exercicesSeriesService: ExercicesSeriesService,
              private categoriesService: CategoriesService,
              private pathologiesService: PathologiesService,
              private niveauxService: NiveauxService,
              private materielsService: MaterielsService,
              private methodesService: MethodesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    // determination de l'utilisateur en fonction de son id
    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.currentUser = item;
      this.senior = this.currentUser.senior ? 'uniquement' : 'hors';
      if (this.currentUser.pathologie) {
        this.pathologie = this.currentUser.pathologie;
        // determination de sa pathologie si elle existe
        this.pathologiesService.getSinglePathologie(this.pathologie.id)
          .then(patho => {
          this.currentPathologie = patho;
          this.isPathologie = true;
        });
      }

    }).then(() => {
      // determination du programme du user en fonction de :
      // son Niveau -- sa Frequence -- son objectif
      this.programmesService
      .getProgrammeByNiveauAndFrequenceAndObjectifs(this.currentUser);
      this.programmesService.prognivsSubject.subscribe(async data => {
        if (data.length !== 0) {
          this.programmes = data[0];
          if (this.programmes.seances.length < this.currentUser.positionseance) {
            this.errorMessage.push(' la position du user ne correspond à aucune seance du programme');
          } else {
            this.seance = this.programmes.seances[this.currentUser.positionseance - 1];
          }

          // recuperation de toutes les methodes correspondantes dans
          // bloc.methodes --- bloc.quartfusion --- bloc.demifusion
          if (this.seance) {

          // on vérifie si (au moins une des user.cat_exe_pathos)
          // est inclu dans programme.seance.cat_exe_pathos)
            this.launchSerieFixe();

            this.currentBloc = this.seance.blocs[1];
            this.getAllMethodesCorrespondantes(this.currentBloc);
          }
        }
      });

      // recuperation des niveaux inférieurs à celui de l'utilisateur
      this.getAllUserNiveaux();

    }).then(() => {
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'echauffement').then(item => {
        this.echauffement = item;
      });
    });
  }


  /*********************************************/
      // ZONE DE DECLARATION DES FONCTIONS
  /*********************************************/


  // fonction de  recuperation des niveaux precedents de l'utilisateur
  getAllUserNiveaux() {
      this.niveauxService.getAllNiveaux();
      this.niveauxService.niveauxSubject.subscribe(data => {
        this.niveaux = data;
        if (this.currentUser.niveau) {
          const position = this.niveaux.findIndex(it => it.id === this.currentUser.niveau.id);
          this.listeNiveau = [];
          for (let index = 0; index <= position; index++) {
            this.listeNiveau.push(this.niveaux[index]);
          }
        }
        // determination de la liste des exercices qui correspondent à l'utilisateur en fonction :
        // genre --- niveau --- position --- age
        this.getAllExercicesForUser();
      });
  }

  // fonction de verification d'inclusion
  // user.cat_exe_pathos => programme.seance.cat_exe_pathos
  launchSerieFixe() {
    if (this.currentPathologie) {
      let local = [];
      this.seance.blocs.forEach(bloc => {
        local = this.currentPathologie.exercicesCategorie.filter(pa => bloc.categoriesexercices
          .findIndex(exe => exe.id === pa.id) >= 0);
      });
      if (local.length > 0) {
        this.lancementSerieFixePathos = true;
      }
    }
  }


  // fonction de recuperation des methodes correspondantes
  // en fonction des heures de pointe
   async getAllMethodesCorrespondantes(currentBloc: Bloc) {
      const data = await this.saveMethodesCorrespondante(currentBloc);
      for (const meth of data) {
        this.methodesService.getSingleMethode(meth.id).then( methode => {
          if (methode.heuredepointe === this.heuredepointe || methode.heuredepointe === 'tout') {
            const idMeth = this.methodesCorrespondantes.findIndex(it => it.id === methode.id);
            if (idMeth < 0) {
              this.methodesCorrespondantes.push(methode);
            }
          }
        });
      }
  }

  // recuperation des methodes du bloc
  saveMethodesCorrespondante(currentBloc: Bloc): Promise<Methode[]> {
    return new Promise(resolve => {
        this.methodesCorrespondantes = [];
        let t1 = []; let t2 = []; let t3 = [];
        if (currentBloc.methodes) {
          t1 = currentBloc.methodes;
        }
        if (currentBloc.quartfusion) {
          t2 = currentBloc.quartfusion;
        }
        if (currentBloc.demifusion) {
          t3 = currentBloc.demifusion;
        }
        resolve(t1.concat(t2).concat(t3));
    });
  }

  // fonctions de determination de la methode aléatoire et des categories exercices
  launch() {
    this.getMethodeAleatoire();
    this.getCategorieExeForBloc();
    this.methodeWorks = this.checkIfMethodWorks() ? true : false;
  }

  getMethodeAleatoire() {
    const i = Math.floor(Math.random() * Math.floor(this.methodesCorrespondantes.length));
    this.methodeAleatoire =  this.methodesCorrespondantes[i];
    for (const serie of this.methodeAleatoire.serieexercice) {
      if (serie.categories && serie.categories.length !== 0) {
        serie.categories.forEach(categ => {
          const id = this.methodeAleatoireCatExe.findIndex(it => it.id === categ.id);
          if (id < 0) {
            this.methodeAleatoireCatExe.push(categ);
          }
        });
      }
    }
  }

  getCategorieExeForBloc() {
    if (this.methodeAleatoireCatExe.length !== 0) {
      this.listeCategories =  this.methodeAleatoireCatExe;
    } else {
      this.listeCategories = this.currentBloc.categoriesexercices;
    }
  }

  // fonction de verification de la validité de la méthode aléatoire
  checkIfMethodWorks(): boolean {
    for (const currentCategorie of this.listeCategories) {
      let n = 0;
      for (const exercice of this.listeExercices) {
        if (exercice.categories) {
          for (const categ of exercice.categories) {
            if (categ.id === currentCategorie.id) {
              n += 1;
            }
          }
        }
      }
      if (n < this.methodeAleatoire.nbrexercicesminimumparcategorie) {
        return false;
      }
    }
    return true;
  }

  // fonction de determination des exercices en fonction des différents paramètres
  getExercicesByScenario(genre, exerciceage, niveau, position) {
    this.exercicesService.getExercicesForUser(genre, exerciceage, niveau, position)
          .then(data => {
            data.forEach(item => {
              const id = this.listeExercices.findIndex(it => it.id === item.id);
              if (id < 0) {
                this.listeExercices.push(item);
              }
            });
    });
  }

  // fonction de determination de la liste des exercices
  // en fonction de la pathologie de l'utilisateur
  getAllExercicesPatho() {
      this.currentPathologie.exercicesCategorie.forEach(item => {
        this.categoriesService.getSingleCategorie(item.id, 'exe_cat').then(categ => {
          categ.exeids.forEach(exeid => {
            const id = this.listeExercices.findIndex(it => it.id === exeid);
            if (id < 0) {
              this.exercicesService.getSingleExercice(exeid).then(exe => {
                this.listeExercices.push(exe);
              });
            }
          });
        });
      });
  }

  // fonction de determination de la liste des exercies
  // en fonction des materiels de l'utilisateur
  getAllExercicesMat() {
    this.currentUser.materiels.forEach(materiel => {
      this.materielsService.getExercicesInSubCollection(materiel).then(exercices => {
        exercices.forEach(exe => {
          const id = this.listeExercices.findIndex(it => it.id === exe.id);
          if (id < 0) {
                this.exercicesService.getSingleExercice(exe.id).then(item => {
                  this.listeExercices.push(item);
                });
          }
        });
      });
    });
  }

  getAllExercicesForUser() {
    // determination des catégories d'âge du user
    const userage = new Date().getFullYear() - new Date(this.currentUser.datedenaissance).getFullYear();
    const exerciceage = ['TOUT'];
    if (userage > 19 && userage < 50) {
      exerciceage.push('SUP19&INF50');
    }
    if (userage > 19) {
      exerciceage.push('SUP19');
    }
    if (userage < 50) {
      exerciceage.push('INF50');
    }

    // determination de la position
    let position = 'toutes';
    if (this.currentUser.position === 'neserelevepasseul') {
      position = 'debout';
    }

    // parcours des catégories d'âge et recuperation de la liste des exercices
    this.listeExercices = [];
    for (const age of exerciceage) {
      // parcours des niveaux
      for (const niveau of this.listeNiveau) {
        // determination des exercices spécifique aux caractéristiques du user
        this.getExercicesByScenario(this.currentUser.genre, age, niveau, position);

        // determination des exercices de tous les sexes
        this.getExercicesByScenario('H&F', age, niveau, position);
      }
    }

    // la liste des exercices en fonction de la pathologie de l'utilisateur
    if (this.isPathologie) {
      this.getAllExercicesPatho();
    }

    // la liste des exercices en fonction des materiels
    if (this.currentUser.materiels && this.currentUser.materiels.length !== 0) {
      this.getAllExercicesMat();
    }

  }

}
