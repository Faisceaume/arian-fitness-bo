import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { Pathologie } from './../../shared/pathologies/pathologie';
import { ExerciceSerie } from './../../exercices-series/exercice-serie';
import { ExercicesSeriesService } from './../../exercices-series/exercices-series.service';
import { Seance } from './../../programmes/seance';
import { Programme } from './../../programmes/programme';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Observable, of, concat, from, forkJoin, Subject, Subscription } from 'rxjs';
import { Bloc } from 'src/app/programmes/bloc';
import { Series } from 'src/app/shared/series';
import { Categorie } from 'src/app/shared/categories/categorie';
import { switchMap } from 'rxjs/operators';

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
  retouraucalme: ExerciceSerie;
  pathologie: PathologieAvance;
  currentPathologie: Pathologie;
  serieFixePathologie: any;
  lancementSerieFixePathos: boolean;
  isPathologie: boolean;
  blockseen: number;

  niveaux: Niveau[];
  listeNiveau: Niveau[] = [];

  listeExercices: Exercice[];
  listeExercicesSelected: Exercice[] = [];
  listeCategories: Categorie[];
  listeCategorieSubject = new Subject<Categorie[]>();

  currentBloc: Bloc;
  methodeAleatoire: Methode;
  methodeAleatoireSubject = new Subject <Methode>();
  methodeAleatoireCatExe: Categorie[] = [];
  methodeWorks: boolean;
  categorieAleatoire: Categorie;

  errorMessage: string[];

  indexSerie = 0;
  listeDesSeries: Series[];
  listeDesExercicesSerie: any[] = [];

  listeDesBlocs: Bloc[];
  heuredepointe: string;

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
          .then((patho: Pathologie) => {
          this.currentPathologie = patho;
          if(patho.seriefixe) {
            this.exercicesSeriesService.getSingleExerciceSerie(patho.seriefixe.id).then(seriefixepathos => {
              this.serieFixePathologie = seriefixepathos;
              console.log(seriefixepathos.id);
            } );
          }
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
            this.errorMessage.push('La position du user ne correspond à aucune seance du programme');
          } else {
            this.seance = this.programmes.seances[this.currentUser.positionseance - 1];
          }

          // recuperation de toutes les methodes correspondantes dans
          // bloc.methodes --- bloc.quartfusion --- bloc.demifusion
          if (this.seance) {

          // on vérifie si (au moins une des user.cat_exe_pathos)
          // est inclu dans programme.seance.cat_exe_pathos)
            this.lancementSerieFixePathos =  this.launchSerieFixe() ? true : false;
            this.listeDesBlocs = this.seance.blocs;
            if (this.lancementSerieFixePathos) {
              this.listeDesBlocs.splice(0, 1);
            }
          }
        }
      });

      // recuperation des niveaux inférieurs à celui de l'utilisateur
      this.getAllUserNiveaux();

    }).then(() => {
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'echauffement').then(item => {
        this.echauffement = item;
      });
      this.exercicesSeriesService.getSerieFixeByTypeAndSenior(this.senior, 'calme').then(item => {
        this.retouraucalme = item;
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
  launchSerieFixe(): boolean {
    let i = 0;
    if (this.currentPathologie) {
      const catexepatho = this.currentPathologie.exercicesCategorie as Categorie[];
      this.seance.blocs.forEach(bloc => {
        bloc.categoriesexercices.forEach(cat => {
          const id = catexepatho.findIndex( c => c.id === cat.id);
          if (id >= 0) {
            i += 1;
          }
        });
      });
    }
    if (i > 0) {
      return true;
    } else {
      return false;
    }
  }


  // fonction de determination de la methode aleatoire
   async getMethodeAleatoire(currentBloc: Bloc, heuredepointe: string) {
        const t1 = currentBloc.methodes ? currentBloc.methodes : [];
        const t2 = currentBloc.quartfusion ? currentBloc.quartfusion : [];
        const t3 = currentBloc.demifusion ? currentBloc.demifusion : [];
        const data = t1.concat(t2).concat(t3);
        of(data).pipe(
          switchMap(val =>  {
            const methodes = val.map(it => this.methodesService.getSingleMethode(it.id));
            return forkJoin(methodes);
          })
        ).subscribe(methode => {
          const all = methode.filter(meth => meth.heuredepointe === heuredepointe ||
            meth.heuredepointe === 'tout');
          const i = Math.floor(Math.random() * Math.floor(all.length));
          this.methodeAleatoireSubject.next(all[i]);
        });
  }

  // fonctions de determination de la methode aléatoire et des categories exercices
  launch(hdp) {
    this.errorMessage = []; this.listeDesExercicesSerie = []; this.indexSerie = 0;
    this.heuredepointe = hdp;
  }

  launchBloc(position: number) {
    // reset message d'erreur && listeDesExercicesSerie && currentBloc
    this.blockseen = position;
    this.errorMessage = []; this.listeDesExercicesSerie = [];
    this.currentBloc = this.listeDesBlocs[position]; this.indexSerie = 0;

    this.getMethodeAleatoire(this.currentBloc, this.heuredepointe);

    this.methodeAleatoireSubject.subscribe((value: Methode) => {
        this.methodeAleatoire = value;
        if (this.methodeAleatoire.serieexercice) {
          this.listeDesSeries = this.methodeAleatoire.serieexercice as Series[];
        }
        this.getMethodeAleatoireCatExe(value);
        this.getCategorieExeForBloc();
        this.methodeWorks = this.checkIfMethodWorks(value) ? true : false;
    });

    this.listeCategorieSubject.subscribe(categories => {
      this.categorieAleatoire = categories[Math.floor(Math.random() * categories.length)];
      this.remplissage(this.methodeAleatoire.serieexercice[0].nbrexparserie, this.categorieAleatoire);
    });
  }

  // fonction go to next serie
  nextSerie() {
    this.indexSerie += 1;
    const serie = this.listeDesSeries[this.indexSerie] as Series;
    const local = [];
    const reste = serie.nbrexparserie - this.listeDesSeries[this.indexSerie - 1].nbrexparserie;
    if (reste <= 0) {
      for (let index = 0; index < serie.nbrexparserie; index++) {
        local.push(this.listeDesExercicesSerie[this.indexSerie - 1][index]);
      }
      this.listeDesExercicesSerie[this.indexSerie] = local;
    } else {
      const type = this.methodeAleatoire.global ? 'global' : 'tout';
      this.getExerciceForSerie(this.categorieAleatoire, type, reste).then((data: Exercice[]) => {
        for (let index = 0; index < this.listeDesSeries[this.indexSerie - 1].nbrexparserie; index++) {
          local.push(this.listeDesExercicesSerie[this.indexSerie - 1][index]);
        }
        data.forEach(exe => local.push(exe) );
        this.listeDesExercicesSerie[this.indexSerie] = local;
      }, error => {
        // tslint:disable-next-line: max-line-length
        this.errorMessage.push('Le nombre d\'exerices du user compatibles avec les catégories, est insuffisant pour la serie de la méthode' + this.indexSerie);
      });
    }
  }

  // fonction de determination des Cat-Exe de la methode aleatoire
  getMethodeAleatoireCatExe(methode: Methode) {
    for (const serie of methode.serieexercice) {
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

  // fonction de remplissage des series de la methode
  remplissage(nb: number, categorie: Categorie) {
    const type = this.methodeAleatoire.global ? 'global' : 'tout';
    this.getExerciceForSerie(categorie, type, nb).then((data: Exercice[]) => {
      this.listeDesExercicesSerie[this.indexSerie] = data;
    }, error => {
      this.errorMessage.push('Le nombre d\'exerices du user compatibles avec les catégories, est insuffisant pour la serie de la méthode');
    });
  }
  getExerciceForSerie(categorie: Categorie, type: string, nombreexercice: number) {
    return new Promise((resolve, reject) => {
      const localExercice = this.listeExercices.filter(exe1 =>
        this.listeExercicesSelected.findIndex(exe2 => exe2.id === exe1.id) < 0 );
      const addExercice = [];

      for (const exercice of localExercice) {
      if (exercice.categories) {

        if (type === 'tout') {
          if (exercice.categories.findIndex(e => e.id === categorie.id) >= 0) {
            addExercice.push(exercice);
            if (!exercice.degressif) {
              this.listeExercicesSelected.push(exercice);
            }
          }
        } else {
          if (exercice.categories.findIndex(e => e.id === categorie.id) >= 0 && exercice.type === type) {
            addExercice.push(exercice);
            if (!exercice.degressif) {
              this.listeExercicesSelected.push(exercice);
            }
          }
        }
        if (nombreexercice === addExercice.length) {
            resolve(addExercice);
            break;
          }
      }
    }
      reject();
    });
  }

  // fonction de recuperation de la liste des Cate-Exe du bloc
  // soit par la methode aleatoire
  // soit par le bloc directement
  getCategorieExeForBloc() {
    if (this.methodeAleatoireCatExe.length !== 0) {
      this.listeCategories =  this.methodeAleatoireCatExe;
      this.listeCategorieSubject.next(this.methodeAleatoireCatExe);
    } else {
      this.listeCategories = this.currentBloc.categoriesexercices;
      this.listeCategorieSubject.next(this.currentBloc.categoriesexercices);
    }
  }

  // fonction de verification de la validité de la méthode aléatoire
  checkIfMethodWorks(methode: Methode): boolean {
    let n = 0;
    for (const currentCategorie of this.listeCategories) {
      n = 0;
      for (const exercice of this.listeExercices) {
        if (exercice.categories) {
          for (const categ of exercice.categories) {
            if (categ.id === currentCategorie.id) {
              if (methode.global && exercice.type === 'global') {
                n += 1;
              } else if (!methode.global) {
                n += 1;
              }
            }
          }
        }
      }
      if (n < methode.nbrexercicesminimumparcategorie) {
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
