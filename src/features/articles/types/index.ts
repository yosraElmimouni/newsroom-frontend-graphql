import type { User } from "../../auth/types";
import type { MediaItem } from "../../capture/types";
import type { Revision } from "../../notification/types";

export type ArticleStatus = 'Brouillon' | 'Publié' | 'Archivé' | 'En attente' | 'Refusé' | 'Supprimé' | 'EnCoursDeValidation' | 'Validé' | 'Invalide';
export type CategorieArticle = 'POLITIQUE' | 'ECONOMIE' | 'TECHNOLOGIE' | 'SPORT' | 'CULTURE' | 'SANTE' | 'EDUCATION' | 'ENVIRONNEMENT' | 'INTERNATIONAL' | 'SOCIETE' | 'SCIENCE' | 'SECURITE' | 'DIVERTISSEMENT' | 'AUTRE';

export interface article {
  id: number;
   title: string;
   contenu: string;
    statut: ArticleStatus;
    categorie: CategorieArticle;
    dateCreation: Date;
    dateModification?: Date;
    datePublication?: Date;
    tags: string[];
    auteur: User;
    medias?: MediaItem[];
    revisions?: Revision[];
    newsItems?: string[];
}