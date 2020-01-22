import { Categorie } from '../shared/categories/categorie';

export class Materiel {
  id: string;
  nom: string;
  timestamp: string;
  postefixe: boolean;
  visibility: boolean;
  categories: Categorie[];
}
