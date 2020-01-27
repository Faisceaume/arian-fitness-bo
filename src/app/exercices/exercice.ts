import { Niveau } from '../shared/niveaux/niveau';
import { Categorie } from '../shared/categories/categorie';

export class Exercice {
id: string;
descriptif: string;
timestamp: number;
agemaximal: number;
ageminimal: number;
echauffement: boolean;
type: string; // "global" ou "analytique" :  radio button
regime: string;
accessalledesport: boolean;
niveau: Niveau; // [id : 'id', nom  : 'nom , nbre : 'nbre', repetitionexercice : '', nbrsemaine: '']
numero: number;
nom: string;
consigne: string;
duree: number; // minute
position: string;
nbrerepetitionechauffement: number;
nbrrepetitionsenior: number;

categories: Categorie[];
}
