import { Categorie } from '../categories/categorie';

export class Pathologie {
  id: string;
  nom: string;
  acronyme: string;
  details: string;
  materielsCategorie: Categorie[];
  exercicesCategorie: Categorie[];
  timestamp: number;
}
