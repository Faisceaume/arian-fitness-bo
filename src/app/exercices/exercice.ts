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
  echauffement: boolean;
  id: string;
  materiels: Materiel[];
  nbrerepetitionechauffement: number;
  nbrrepetitionsenior: number;
  niveaumax: Niveau;
  nom: string;
  numero: number;
  pathologie: string;
  position: string;
  regime: string;
  repetitionsexercice: boolean;
  retouraucalme: boolean;
  senior: string;
  timestamp: number;
  type: string;
  visibility: boolean;
  visuel: boolean;
}
