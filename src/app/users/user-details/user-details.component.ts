import { QuestionnairesService } from './../../questionnaires/questionnaires.service';
import { UserQuestionsComponent } from './../user-questions/user-questions.component';
import { MatDialog } from '@angular/material';
import { PathologieAvance } from './../../exercices-series/pathologie-avance';
import { Pathologie } from 'src/app/shared/pathologies/pathologie';
import { PathologiesService } from './../../shared/pathologies/pathologies.service';
import { ObjectifsService } from 'src/app/shared/objectifs/objectifs.service';
import { Objectif } from 'src/app/shared/objectifs/objectif';
import { Listes } from 'src/app/shared/listes';
import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FormControl } from '@angular/forms';
import { Niveau } from 'src/app/shared/niveaux/niveau';
import { NiveauxService } from 'src/app/shared/niveaux/niveaux.service';
import { UsersService } from '../users.service';
import { SharedService } from 'src/app/shared/shared.service';

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
  datefindepremiumControl = new FormControl();
  datedernierlogControl = new FormControl();
  datedernieremajControl = new FormControl();

  toChangeNiveau: boolean;
  toChangeNiveauOff: boolean;
  toChangeNiveauIns: boolean;
  showObjectif: boolean;
  toAddPathologie: boolean;

  resultQ1: any;

  constructor(private activeRoute: ActivatedRoute,
              private niveauxService: NiveauxService,
              private usersService: UsersService,
              private sharedService: SharedService,
              private objectifsService: ObjectifsService,
              private pathologiesService: PathologiesService,
              private questionnairesService: QuestionnairesService,
              public dialog: MatDialog) { }

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
      this.seniorControl.setValue(item.senior);
      this.premiumControl.setValue(item.premium);
      this.datenaissanceControl.setValue(new Date(item.datedenaissance));
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
    this.niveauxService.getAllNiveaux();
    this.niveauxService.niveauxSubject.subscribe(data => {
      this.niveaux = data;
    });
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

        // determination de l'objectif du User
        const libelle = this.resultQ1.questions[4].reponses === 'Autre' ?
                        this.resultQ1.questions[5].reponses : this.resultQ1.questions[4].reponses;

        this.objectifsService.getSingleObjectifByNom(libelle).then(
          (item: Objectif) => {
            this.formData.objectif = item;
            this.updateField('objectif', this.formData.objectif);
          },
          (error) => {
            console.log('empty objectif');
          }
        );
        this.questionnairesService.createQuestionOnUser(this.formData.id, this.resultQ1.questions);
        this.updateField('questionnaire1', true);
        this.formData.questionnaire1 = true;
      }
    });
  }

  launchQ2() {
    const dialogRef = this.dialog.open(UserQuestionsComponent, {
      width: '80%',
      data: {
        name: '2- Questionnaire Premium pour démarrer un programme',
        niveaunombre: this.formData.niveau.nombre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  ngOnDestroy(): void {
    this.usersService.currentUser = null;
  }
}
