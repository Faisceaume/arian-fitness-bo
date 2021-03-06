import { Niveau } from '../shared/niveaux/niveau';
import { Series } from '../shared/series';
import { Objectif } from '../shared/objectifs/objectif';

export class Methode {
  id: string; // id
  nom: string;
  acronyme: string; // (4 caract max)
  orientation: string; // radio button :renforcement ou cardio
  duree: number; // en min
  niveau: Niveau; // liste des niveaux
  consigne: string;
  heuredepointe: string;
  nbrseries: number; // list
  nbrexercicesminimumparcategorie: number; //  list entre 1 et 12
  senior: string;
  global: boolean;
  objectifs: Objectif[];
  serieexercice?: Series[];
  timestamp: string;
}
