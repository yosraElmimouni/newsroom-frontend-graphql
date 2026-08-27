import type { article } from "../../articles/types";


export type CategorieNews = 
'BREAKING_NEWS' | 'POLITIQUE' | 'ECONOMIE' | 'TECHNOLOGIE' | 'SPORT' | 'CULTURE' | 'INTERNATIONAL' | 'BUSINESS' | 'IA' | 'CYBERSECURITE' | 'SANTE' | 'SCIENCE' | 'ENVIRONNEMENT' | 'RESEAUX_SOCIAUX'|  'AUTRE';

export interface NewsItems {
    id: number;
    titre: string;
    contenu: string;
    categorie: CategorieNews;
    url: string;
    datePublication: Date;
    source: Source;
    article: article;
}

export type TypeSource='WEB'|'API'|'JOURNAL'|'MAGAZINE'|'TV'|'RADIO'|'RESEAU_SOCIAL'|'AGENCE_PRESSE'|'BLOG'|'PODCAST'|'COMMUNIQUE_OFFICIEL'|'REPORTAGE_TERRAIN'|'AUTRE';
export interface Source {
    id:number;
    nom:string;
    url:string;
    type:TypeSource;
    fiable: boolean;
    logoUrl: string;
    pays: string;
    langue: string;
    dateCreation: Date;
    newsItems: NewsItems[];
}

