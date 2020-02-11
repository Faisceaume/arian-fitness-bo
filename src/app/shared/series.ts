import { Categorie } from './categories/categorie';

export class Series {
  custom = false;
  travail: number;
  repos: number;
  ordreexercicemodifiable = false;
  categories: Categorie[] = [];
  nbrexparserie: number;
}
