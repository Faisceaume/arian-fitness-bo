export class Aliment {
  id: string;
  nom: string;
  proteines: number;
  glucides: number;
  glucidessimples: number;
  glucidescomplexe: number;
  lactoses: number;
  lipides: number;
  lipidessatures: number;
  lipidesmonoinsatures: number;
  lipidesmonopolyinsatures: number;
  ratioomega: string; // ratio // oméga 6 et oméga 3
  fibres: number;
  kcal: number;
  valide: boolean;
  ig: number; // (indice glycémique) (entre 0 et 100)
  sodium: number;
  sel: number;
  timestamp: number;
  source: string; // (manuelle / Opend food fact)
  image: string;
}
