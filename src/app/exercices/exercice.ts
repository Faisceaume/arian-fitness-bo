import { Niveau } from '../shared/niveaux/niveau';
import { Categorie } from '../shared/categories/categorie';
import { Materiel } from '../materiels/materiel';

export class Exercice {
  accessalledesport: boolean;
  age: string;
  categories: Categorie[];
  consignecourte: string;
  consignelongue: string;
  degressif: boolean;
  echauffement: boolean;
  genre: string;
  id: string;
  intermittent: boolean;
  materiels: Materiel[];
  nbrerepetitionechauffement: number;
  nbrrepetitionsenior: number;
  nbrerepetretourcalme: number;
  nbrerepetitionexercice: number;
  niveau: Niveau;
  nom: string;
  numero: number;
  pathologie: string;
  photo?: string;
  position: string;
  regime: string[];
  repetitionexercice: boolean;
  retouraucalme: boolean;
  senior: string;
  timestamp: number;
  time: number;
  type: string;
  unilateral: boolean;
  video?: string;
  visibility: boolean;
  visuel: boolean;

  seriefixeid?: string[];
}
