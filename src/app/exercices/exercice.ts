import { Categorie } from '../shared/categories/categorie';

export class Exercice {
  id: string;
  nom: string;
  timestamp: string;
  description: boolean;
  categories: Categorie[];
}
