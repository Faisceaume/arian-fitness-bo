import { Categorie } from '../shared/categories-section/categorie';

export class Exercice {
  id: string;
  nom: string;
  timestamp: string;
  description: boolean;
  categories: Categorie[];
}
