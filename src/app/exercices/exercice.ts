import { Niveau } from '../shared/niveaux/niveau';
import { Categorie } from '../shared/categories/categorie';
import { Materiel } from '../materiels/materiel';

export class Exercice {
  accessalledesport: boolean;
  age: string;
  categories: Categorie[];
  consigne: string;
  duree: number;
  degressif: boolean;
  descriptif: string;
  echauffement: boolean;
  id: string;
  materiels: Materiel[];
  niveaumax: Niveau;
  nbrerepetitionechauffement: number;
  nbrrepetitionsenior: number;
  nom: string;
  numero: number;
  pathologie: string;
  regime: string;
  repetitionsexercice: boolean;
  position: string;
  retouraucalme: boolean;
  timestamp: number;
  type: string;
  visuel: boolean;
}
