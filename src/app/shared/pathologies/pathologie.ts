import { ExerciceSerieAvance } from './../../programmes/exercice-serie-avance';
import { Categorie } from '../categories/categorie';

export class Pathologie {
  id: string;
  nom: string;
  acronyme: string;
  details: string;
  type: string;
  materielsCategorie: Categorie[];
  exercicesCategorie: Categorie[];
  timestamp: number;

  seriefixe?: ExerciceSerieAvance;
}
