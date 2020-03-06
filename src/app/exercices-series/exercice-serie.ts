import { ExerciceAvance } from './../SHARED/exercice-avance';
import { Pathologie } from './../shared/pathologies/pathologie';

export class ExerciceSerie {
  id: string;
  nom: string;
  type: string;
  consigne: string;
  senior: string;
  pathologies: Pathologie[];
  exercices: ExerciceAvance[];
}
