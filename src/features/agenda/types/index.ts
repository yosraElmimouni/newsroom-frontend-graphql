
export interface agenda {
  id: number;
  title: string;
    resume: string;
    categorie: string;  
    importance: string;
    dateDebut: Date;
    dateFin: Date;
    lieu: string;
    source: {
      id: number;
      nom: string;
      url: string;
    };
}
