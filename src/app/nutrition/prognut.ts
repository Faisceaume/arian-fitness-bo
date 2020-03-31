import { Scenario } from './scenario';
import { Objectif } from './../shared/objectifs/objectif';
export class Prognut {
  id: string;
  nom: string;
  objectif: Objectif;
  nbrescenarios: number;
  listescenarios: Scenario[];
}
