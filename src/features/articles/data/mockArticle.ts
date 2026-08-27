import type { User } from "../../auth/types";
import type { article, ArticleStatus } from "../types";


export const STATUS_BADGE_CLASS: Record<ArticleStatus, string> = {
  Brouillon: "status-brouillon",
  Publié: "status-publie",
  Archivé: "status-archive",
  "En attente": "status-attente",
  Refusé: "status-refuse",
  Supprimé: "status-supprime",
  EnCoursDeValidation: "status-validation",
  Validé: "status-valide",
  Invalide: "status-invalide",
};

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  Brouillon: 'Brouillon',
  Publié: 'Publié',
  Archivé: 'Archivé',
  'En attente': 'En attente',
  Refusé: 'Refusé',
  Supprimé: 'Supprimé',
  EnCoursDeValidation: 'En cours de validation',
  Validé: 'Validé',
  Invalide: 'Invalide',
};

export const STATUS_OPTIONS = Object.keys(STATUS_LABEL) as ArticleStatus[];

export const CATEGORY_OPTIONS = [
  'POLITIQUE',
  'ECONOMIE',
  'TECHNOLOGIE',
  'SPORT',
  'CULTURE',
  'SANTE',
  'EDUCATION',
  'ENVIRONNEMENT',
  'INTERNATIONAL',
  'SOCIETE',
  'SCIENCE',
  'SECURITE',
  'DIVERTISSEMENT',
  'AUTRE',
] as const;

export type CategorieArticle = (typeof CATEGORY_OPTIONS)[number];

const users : User[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    nom: "Doe",
    prenom: "John",
    role: 'JOURNALISTE',
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    nom: "Smith",
    prenom: "Jane",
    role: 'JOURNALISTE',
  },
  {
    id: 3,
    email: "bob.johnson@example.com",
    nom: "Johnson",
    prenom: "Bob",
    role: "JOURNALISTE",
  },
];
export const STATIC_ARTICLES: article[] = [];

export function getArticleItemById(id: number): article | undefined{
  return STATIC_ARTICLES.find((item) => item.id === id);
}
export function getArticles() {
  return STATIC_ARTICLES;
}