import { Categorie } from '../shared/categories-section/categorie';

export class Materiel {
  id: string;
  nom: string;
  timestamp: string;
  postefixe: boolean;
  visibility: boolean;
  categories: Categorie[];
}
