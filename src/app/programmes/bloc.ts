import { Categorie } from 'src/app/shared/categories/categorie';
import { Methode } from '../methodes/methode';

export class Bloc {
  duree = '';
  fusionnable = false;
  orientation = 'cardio';
  methodes: Methode[] = [];
  categoriesexercices?: Categorie[] = [];
}
