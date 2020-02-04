import { Niveau } from '../shared/niveaux/niveau';
import { Series } from '../shared/series';

export class Methode {
  id: string; // id
  nom: string;
  acronyme: string; // (4 caract max)
  orientation: string; // radio button :renforcement ou cardio
  dureeminimum: number; // en min
  niveau: Niveau; // liste des niveaux
  consigne: string;


  nbrseries: number; // list
  nbrexparserie: number; // list entre 1 et 10
  nbrexercicesminimum: number; //  list entre 1 et 12

  senior: boolean;
  global: boolean;
  ordreexercicemodifiable: boolean;
  custom: boolean;

  serieexercice?: Series[];
  timestamp: string;
}
