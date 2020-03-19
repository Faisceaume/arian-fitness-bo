import { PathologieAvance } from './../exercices-series/pathologie-avance';
import { Bloc } from './bloc';
import { CategorieAvance } from './categorie-avance';
import { ExerciceSerieAvance } from './exercice-serie-avance';

export class Seance {
  pathologies: PathologieAvance[] = [];
  categoriesexercices: CategorieAvance[] = [];
  echauffement: ExerciceSerieAvance;
  blocs: Bloc[] = [];

  toAddPathologie = false;
}
