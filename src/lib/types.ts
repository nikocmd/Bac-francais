export interface AnalyseLineaire {
  introduction: string;
  mouvements: {
    numero: number;
    titre: string;
    lignes: string;
    procedes: { procede: string; exemple: string; effet: string }[];
  }[];
  conclusion: string;
  ouverture: string;
}

export interface FeedbackOral {
  note: number;
  appreciation: string;
  points_forts: string[];
  axes_amelioration: string[];
  conseils: string[];
}

export interface ResultatExamen {
  note: number;
  mention: string;
  criteres: {
    nom: string;
    note: number;
    sur: number;
    commentaire: string;
  }[];
  bilan: string;
  encouragement: string;
}
