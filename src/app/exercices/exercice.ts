import { Niveau } from '../shared/niveaux/niveau';
import { Categorie } from '../shared/categories/categorie';

export class Exercice {
  accessalledesport: boolean;
  categories: Categorie[];
  consigne: string;
  timestamp: number;
  agemaximal: number;
  ageminimal: number;
  degressif: boolean;
  descriptif: string;
  echauffement: boolean;
  id: string;
  niveaumax: Niveau;
  nbrerepetitionechauffement: number;
  nbrrepetitionsenior: number;
  nom: string;
  numero: number;
  type: string;
  regime: string;
  repetitionsexercice: boolean;
  duree: number;
  position: string;
  retouraucalme: boolean;
  visuel: boolean;
}
