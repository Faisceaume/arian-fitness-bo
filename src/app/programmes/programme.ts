import { Niveau } from '../shared/niveaux/niveau';
import { Objectif } from '../shared/objectifs/objectif';
import { Seance } from './seance';

export class Programme {
  id: string;
  numero: number;
  acronyme: string;
  extra: boolean;
  duree?: number;
  frequence: number;
  niveau: Niveau;
  objectifs: Objectif[];
  custompointsfaibles: boolean;
  timestamp: string;

  semaineduniveau?: number[];
  nbrsemaine: number;
  seances: Seance[];
}
