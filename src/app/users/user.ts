import { Materiel } from './../materiels/materiel';
import { PathologieAvance } from './../exercices-series/pathologie-avance';
import { Objectif } from '../shared/objectifs/objectif';
import { Niveau } from '../shared/niveaux/niveau';

export class User {
 id: string;
 email: string;
 nom: string;
 prenom: string;
 datedenaissance: any;
 abonnement: number; // choix entre 1,3,12;
 premium: boolean;
 datefindepremium: any; // date;
 tarif: string;
 frequence: number; // choix list (2, 3, 4 ou 5)
 telephone: string;
 genre: string; // H ou F
 password: string;
 datedernierlog: any;
 datedernieremaj: any;
 senior: boolean;
 niveau: Niveau; //  liste niveaux
 modereprise: string; // >60J<90J, >=90J<180J, >=180J, 0
 frequenceparjour: number;
 positionparcoursniveau: number;  // x/24
 positionseance: number;
 niveauinscription: Niveau;
 niveauavantperiodeoff: Niveau;
 parcoursnutrition: string; // x/y
 photo?: string;


 materiels: any[];
 pathologie: PathologieAvance; // multi select sur le noeud pathologie
 objectif: Objectif; // liste noeud objectif
 trophee: string;

 questionnaire1?: boolean;
 questionnaire2?: boolean;
 questionnaire3?: boolean;
 position: string;

 timestamp: string;
}
