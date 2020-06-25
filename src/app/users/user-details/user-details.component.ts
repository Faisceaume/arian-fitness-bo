import { MaterielAvance } from './../materiel-avance';
import { QuestionnairesService } from './../../questionnaires/questionnaires.service';
import { UserQuestionsComponent } from './../user-questions/user-questions.component';
import { MatDialog } from '@angular/material';
import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { Pathologie } from 'src/app/shared/pathologies/pathologie';
import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { Listes } from 'src/app/shared/listes';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FormControl } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { UsersService } from '../users.service';
import { SharedService } from 'src/app/shared/shared.service';
import { StripecheckoutService } from '../stripecheckout/stripecheckout.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  formData: User;
  niveauSelected: Niveau;
  niveaux: Niveau[];
  objectifs: Objectif[];
  editdates = false;
  modereprise = ['0', '>60J<90J', '>=90J<180J', '>=180J'];
  listePositionParc = new Listes().positionparcoursniveau;
  listeFrequence = new Listes().frequenceUser;
  pathologies: Pathologie[];

  premiumControl = new FormControl();
  seniorControl = new FormControl();
  datenaissanceControl = new FormControl();
  datefindepremiumControl = new FormControl({disabled: true});
  datedernierlogControl = new FormControl();
  datedernieremajControl = new FormControl();

  toChangeNiveau: boolean;
  toChangeNiveauOff: boolean;
  toChangeNiveauIns: boolean;
  toChangeModeReprise: boolean;
  showObjectif: boolean;
  toAddPathologie: boolean;

  resultQ1: any;
  resultQ2: any;
  resultQ3: any;
  resultQ4: any;
  resultQ5: any;
  resultQ6: any;
  asSDS = true;

  constructor(private activeRoute: ActivatedRoute,
              private niveauxService: NiveauxService,
              private usersService: UsersService,
              private sharedService: SharedService,
              private objectifsService: ObjectifsService,
              private pathologiesService: PathologiesService,
              private questionnairesService: QuestionnairesService,
              public dialog: MatDialog,
              private paymentService: StripecheckoutService,
              private auth: AuthService) { }

  handler: StripeCheckoutHandler;
  abonnement: any;

  ngOnInit() {
    const id = this.activeRoute.snapshot.params.id;

    this.objectifsService.getAllObjectifs();
    this.objectifsService.objectifSubject.subscribe(data => {
      this.objectifs = data;
    });

    this.pathologiesService.getAllPathologies();
    this.pathologiesService.pathologieSubject.subscribe(data => {
      this.pathologies = data;
    });

    this.usersService.getSingleUser(null, id).then((item: User) => {
      this.formData = item;
      this.abonnement = this.formData.abonnement;
      this.seniorControl.setValue(item.senior);
      this.premiumControl.setValue(item.premium);
      this.datenaissanceControl.setValue(new Date(item.datedenaissance));
      this.datefindepremiumControl.disable();
      this.datefindepremiumControl.setValue(new Date(item.datefindepremium));
      this.datedernierlogControl.setValue(new Date(item.datedernierlog));
      this.datedernieremajControl.setValue(new Date(item.datedernieremaj));
      this.sharedService.currentUser = item;

      if (item.photo) {
        this.sharedService.fileUrl = item.photo;
      } else {
        this.sharedService.fileUrl = null;
      }

    });

    this.premiumControl.valueChanges.subscribe(data => {
      this.formData.premium = data;
    });



    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });

    /* Stripe checkout */
    this.handler = StripeCheckout.configure({
      key: 'pk_test_5bJ3goCC3VtkgGeYP8UyENKJ00nI3rnCk1',
      locale: 'auto',
      currency: 'eur'
    });
  }
  /* Stripe checkout functions */
  async checkout(e) {
    const user = await this.auth.getUser();
    let amount = 0;
    if (this.formData.abonnement === 12) {
      amount = 1200;
    } else if (this.formData.abonnement === 3) {
      amount = 300;
    } else {
      amount = 100;
    }
    this.handler.open({
        name: 'Abonnement',
        amount: amount,
        email: user.email,
        token: token => {
          this.paymentService.processPayment(token, amount, this.activeRoute.snapshot.params.id);
          this.updateField('abonnement', this.formData.abonnement);
        },
        closed: () => {
          console.log('fermer');
        }
    });
  }
  @HostListener('window:popstate')
  onPopstate() {
    console.log('fermer par le user');
    this.handler.close();
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  updateField(attribut: string, value: any, isDate?: boolean) {
    if (isDate) {
      this.usersService.newUpdateVersion(this.formData, attribut, value.getTime());
    } else {
      this.usersService.newUpdateVersion(this.formData, attribut, value);
    }
  }

  selectObjectif(it: Objectif) {
    this.formData.objectif = it;
    this.updateField('objectif', this.formData.objectif);
    this.showObjectif = false;
  }

  selectedPathologie(item: Pathologie) {
    const local = new PathologieAvance();
    local.acronyme = item.acronyme;
    local.id = item.id;
    local.nom = item.nom;

    this.formData.pathologie = local;
    this.updateField('pathologie', Object.assign({}, this.formData.pathologie));
    this.toAddPathologie = false;
  }


  /*********************************************/
      // QUESTIONNAIRE 1
  /*********************************************/
  launchQ1() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {name: '1- Questionnaire entrée de l\'application'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resultQ1 = result;
        this.resultQ1.questions.forEach((element, index) => {
          element.reponses = result.reponses[index];
        });

        // determination du sexe
        this.formData.genre = this.resultQ1.questions[0].reponses === 'Un homme' ? 'H' : 'F';
        this.updateField('genre', this.formData.genre);

        // les reponses du questionnaire
        const response1 = this.resultQ1.questions[1].reponses;
        const response2 = this.resultQ1.questions[2].reponses;
        const response3 = this.resultQ1.questions[3].reponses;
        const response4 = this.resultQ1.questions[4].reponses;
        const response5 = this.resultQ1.questions[5].reponses;


        // renseignement des materiels du user
        if (response3 !== 'non fourni') {
          this.formData.materiels = response3;
          const data = [];
          this.formData.materiels.forEach(item => {
            const local = new MaterielAvance();
            local.id = item.id;
            local.nom = item.nom;
            local.postefixe = item.postefixe;
            data.push(Object.assign({}, local));

            item.categories.forEach(it => {
              if (it.acronyme === 'SDS') {
                this.asSDS = true;
              }
            });
          });
          this.resultQ1.questions[3].reponses = data;
          this.formData.materiels = data;
          this.updateField('materiels', this.formData.materiels);
        }
        // determination objectif et niveau

        if (response1 !== 'Non' && response1 !== 'non fourni') {
          this.formData.niveau = this.niveaux[0];
        } else if (response2[0] === 'N') {
          this.formData.niveau = this.niveaux[0];
        } else if (response2[0] === 'I') {
          this.formData.niveau = this.niveaux[2];
        } else if (response2[0] === 'E') {
          this.formData.niveau = this.niveaux[3];
        } else if (response2[0] === 'A') {
          this.formData.niveau = this.niveaux[4];
        }

        if (response1.trim() === 'Oui, il s\'agit d\'une maladie, ou d\'une intervention,ayant touché mon système cardio-respiratoire.') {
          this.objectif('COEUR');
        } else if (response1.trim() === 'Oui, j\'ai subi des troubles locomoteurs et neurologiques.') {
          this.objectif('LOCO');
        } else if (response1.trim() === 'Oui, je suis en rémission d\'un cancer.') {
          this.objectif('CANCR');
        } else if (response1.trim() === 'Non') {
          if (response4.trim() === 'Mincir') {
            this.objectif('MINC');
          } else if (response4.trim() === 'Mincir et me muscler') {
            this.objectif('MINMU');
          } else if (response4.trim() === 'Me muscler') {
            this.objectif('MM');
          } else if (response4.trim() === 'Stabilisation et anti-âge') {
            this.objectif('AGE');
          }

          if (response5[0] === 'P') {
            this.objectif('PUI');
          } else if (response5[0] === 'E') {
            this.objectif('END');
          }
        }

        this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ1.questions);
        this.updateField('questionnaire1', true);
        this.updateField('niveau', this.formData.niveau);
        this.formData.questionnaire1 = true;
      }
    });
  }


  /*********************************************/
      // QUESTIONNAIRE 2
  /*********************************************/
  launchQ2() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '2- Questionnaire Premium pour démarrer un programme',
        niveaunombre: this.formData.niveau.nombre,
        asSDS: this.asSDS
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.resultQ2 = result;
          this.resultQ2.questions.forEach((element, index) => {
            element.reponses = result.reponses[index];
          });

        // DETERMINATION DE LA PATHOLOGIE DU USER
          const response1 = result.reponses[1];
          if (response1 !== 'non fourni') {
            this.formData.pathologie = response1;
            this.updateField('pathologie', this.formData.pathologie);
          }

        // DETERMINATION DE LA FREQUENCE DU USER
          const response2 = this.resultQ2.questions[2].reponses;
          if (response2 !== 'non fourni') {
            // tslint:disable-next-line: radix
            this.formData.frequence = parseInt(response2[0]);
            this.updateField('frequence', this.formData.frequence);
          }

          const response3 = this.resultQ2.questions[3].reponses;
          if (response3 !== 'non fourni') {
            // tslint:disable-next-line: radix
            this.formData.frequence = parseInt(response3[0]);
            this.updateField('frequence', this.formData.frequence);
          }

          this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ2.questions);
          this.updateField('questionnaire2', true);
          this.formData.questionnaire2 = true;
      }

    });
  }


  /*********************************************/
      // QUESTIONNAIRE 3
  /*********************************************/
  launchQ3() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '3- Questionnaire d\'entrée de l\'application senior S80+',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.resultQ3 = result;
          this.resultQ3.questions.forEach((element, index) => {
            element.reponses = result.reponses[index];
          });

          const response1 = this.resultQ3.questions[1].reponses;
          const response2 = this.resultQ3.questions[2].reponses;

        // determination du sexe
          this.formData.genre = this.resultQ3.questions[0].reponses === 'Un homme' ? 'H' : 'F';
          this.updateField('genre', this.formData.genre);

          // renseignement des materiels du user
          if (response2 !== 'non fourni') {
            this.formData.materiels = response2;
            const data = [];
            this.formData.materiels.forEach(item => {
              const local = new MaterielAvance();
              local.id = item.id;
              local.nom = item.nom;
              local.postefixe = item.postefixe;
              data.push(Object.assign({}, local));

              item.categories.forEach(it => {
                if (it.acronyme === 'SDS') {
                  this.asSDS = true;
                }
              });
            });
            this.resultQ3.questions[2].reponses = data;
            this.formData.materiels = data;
            this.updateField('materiels', this.formData.materiels);
          }

          // determination de la position du user
          if (response1 !== 'non fourno') {
            this.formData.position = response1 === 'Oui' ? 'sereleveseul' : 'neserelevepasseul';
            this.updateField('position', this.formData.position);
          }

          this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ3.questions);
          this.updateField('questionnaire3', true);
          this.formData.questionnaire3 = true;
      }

    });
  }



  /*********************************************/
      // QUESTIONNAIRE 4
  /*********************************************/
  launchQ4() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '4- Questionnaire senior S80+ premium pour démarrer un programme',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.resultQ4 = result;
          this.resultQ4.questions.forEach((element, index) => {
            element.reponses = result.reponses[index];
          });

          // DETERMINATION DE LA FREQUENCE DU USER
          const response1 = this.resultQ4.questions[1].reponses;
          if (response1 !== 'non fourni') {
            // tslint:disable-next-line: radix
            this.formData.frequence = parseInt(response1[0]);
            this.updateField('frequence', this.formData.frequence);
          }

          // RENSEIGNEMENT DES MATERIELS DU USERS
          const response0 = this.resultQ4.questions[0].reponses;
          if (response0 !== 'non fourni') {
            this.formData.materiels = response0;
            const data = [];
            this.formData.materiels.forEach(item => {
              const local = new MaterielAvance();
              local.id = item.id;
              local.nom = item.nom;
              local.postefixe = item.postefixe;
              data.push(Object.assign({}, local));

              item.categories.forEach(it => {
                if (it.acronyme === 'SDS') {
                  this.asSDS = true;
                }
              });
            });
            this.resultQ4.questions[0].reponses = data;
            this.formData.materiels = data;
            this.updateField('materiels', this.formData.materiels);
          }

          this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ4.questions);
          this.updateField('questionnaire4', true);
          this.formData.questionnaire4 = true;
    }
  });

  }


  /*********************************************/
      // QUESTIONNAIRE 5
  /*********************************************/
  launchQ5() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '5- Questionnaire récurrent Extra',
        premium: this.premiumControl.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.resultQ5 = result;
          this.resultQ5.questions.forEach((element, index) => {
            element.reponses = result.reponses[index];
          });

          // DETERMINATION EXTRADUREE DU USER
          const response0 = this.resultQ5.questions[0].reponses;
          if (response0 !== 'non foruni') {
            this.formData.extraduree = response0;
            this.updateField('extraduree', this.formData.extraduree);
          }

          // RENSEIGNEMENT DES EXTRAMATERIELS DU USERS
          const response1 = this.resultQ5.questions[1].reponses;
          if (response1 !== 'non fourni') {
            this.formData.extramateriels = response1;
            const data = [];
            this.formData.extramateriels.forEach(item => {
              const local = new MaterielAvance();
              local.id = item.id;
              local.nom = item.nom;
              local.postefixe = item.postefixe;
              data.push(Object.assign({}, local));

              item.categories.forEach(it => {
                if (it.acronyme === 'SDS') {
                  this.asSDS = true;
                }
              });
            });
            this.resultQ5.questions[1].reponses = data;
            this.formData.extramateriels = data;
            this.updateField('extramateriels', this.formData.extramateriels);
          }

          // DETERMINATION USER OBJECTIF JOUR
          const response2 = this.resultQ5.questions[2].reponses;
          if (response2 !== 'non fourni') {
            if (response2 === 'Rééducation uniquement') {
              this.objectifjour('REEDU');
            } else if (response2 === 'Global cardio HIIT') {
              this.objectifjour('GLOCA');
            } else if (response2 === 'Groupe(s) musculaire(s) au choix') {
              this.objectifjour('GPEMU');
            } else if (response2 === 'Renforcement de tout le corps') {
              this.objectifjour('FULLB');
            }
          }

          // DETERMINATION EXTRAPATHOS DU USER
          const response3 = this.resultQ5.questions[3].reponses;
          if (response3 !== 'non fourni') {
            this.formData.extrapathos = response3;
            this.updateField('extrapathos', this.formData.extrapathos);
          }

          // DETERMINATION EXTRA GROUPE MUSCULAIRE DU USER
          const response4 = this.resultQ5.questions[4].reponses;
          if (response4 !== 'non fourni') {
            this.formData.extragpemuscu = response3;
            this.updateField('extragpemuscu', this.formData.extragpemuscu);
          }


          this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ5.questions);
          this.updateField('questionnaire5', true);
          this.formData.questionnaire5 = true;
    }
  });

  }

  /*********************************************/
      // QUESTIONNAIRE 6
  /*********************************************/
  launchQ6() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '6- Questionnaire récurrent Extra sénior S80+',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.resultQ6 = result;
          this.resultQ6.questions.forEach((element, index) => {
            element.reponses = result.reponses[index];
          });

          // RENSEIGNEMENT DES MATERIELS DU USERS
          const response1 = this.resultQ6.questions[1].reponses;
          if (response1 !== 'non fourni') {
            this.formData.extraseniormateriel = response1;
            const data = [];
            this.formData.extraseniormateriel.forEach(item => {
              const local = new MaterielAvance();
              local.id = item.id;
              local.nom = item.nom;
              local.postefixe = item.postefixe;
              data.push(Object.assign({}, local));

              item.categories.forEach(it => {
                if (it.acronyme === 'SDS') {
                  this.asSDS = true;
                }
              });
            });
            this.resultQ6.questions[1].reponses = data;
            this.formData.extraseniormateriel = data;
            this.updateField('extraseniormateriel', this.formData.extraseniormateriel);
          }

          // DETERMINATION extraseniorobjectifjour DU USER
          const response0 = this.resultQ6.questions[0].reponses.trim();
          if (response0 !== 'non fourni') {
            if (response0 === 'Renforcement du bas du corps') {
              this.extraseniorobjectifjour('BAS80');
            } else if (response0 === 'Renforcement du haut du corps') {
              this.extraseniorobjectifjour('HAU80');
            } else if (response0 === 'Posture et technique de marche') {
              this.extraseniorobjectifjour('PM80');
            } else if (response0 === 'Renforcement de tout votre corps') {
              this.extraseniorobjectifjour('FUL80');
            }
          }

          this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ6.questions);
          this.updateField('questionnaire6', true);
          this.formData.questionnaire6 = true;

    }
  });

  }


  // FONCTIONS FACTORISEES POUR LES QUESTIONNAIRES

      // determination objectifjour du user
      objectifjour(acronyme: string) {
        this.objectifsService.getSingleObjectifByNomOrAcronyme('', acronyme).then(
          (item: Objectif) => {
            this.formData.objectifjour = item;
            this.updateField('objectifjour', this.formData.objectifjour);
          },
          (error) => {
            console.log('empty objectif');
          }
        );
      }

      // determination objectif user
      objectif(acronyme: string) {
        this.objectifsService.getSingleObjectifByNomOrAcronyme('', acronyme).then(
          (item: Objectif) => {
            this.formData.objectif = item;
            this.updateField('objectif', this.formData.objectif);
          },
          (error) => {
            console.log('empty objectif');
          }
        );
      }

      // determination extraseniorobjectifjour du user
      extraseniorobjectifjour(acronyme: string) {
        this.objectifsService.getSingleObjectifByNomOrAcronyme('', acronyme).then(
          (item: Objectif) => {
            this.formData.extraseniorobjectifjour = item;
            this.updateField('extraseniorobjectifjour', this.formData.extraseniorobjectifjour);
          },
          (error) => {
            console.log('empty objectif');
          }
        );
      }


  ngOnDestroy(): void {
    this.usersService.currentUser = null;
  }
}
