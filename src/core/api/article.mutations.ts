import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { ArticleStatus, CategorieArticle } from '../../features/articles/types';


export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($createArticleInput: CreateArticleInput!) {
    createArticle(createArticleInput: $createArticleInput) {
      id
      titre
      contenu
      statut
      categorie
      tags
      dateCreation
      auteur {
        id
      }
    }
  }
`;


export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle($updateArticleInput: UpdateArticleInput!) {
    updateArticle(updateArticleInput: $updateArticleInput) {
        id
        dateModification
        datePublication
      }
  }
`;


interface ArticleAuteur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

interface ArticleFull {
  id: number;
  titre: string;
  contenu: string;
  statut: ArticleStatus;
  categorie: CategorieArticle;
  tags: string[] | null;
  dateCreation: string;
  dateModification: string;
  datePublication: string | null;
  auteur: ArticleAuteur;
}

interface GetArticlesData {
  articles: ArticleFull[];
}

export const GET_ARTICLES_QUERY: TypedDocumentNode<GetArticlesData> = gql`
  query GetArticles {
    articles {
      id
      titre
      contenu
      statut
      categorie
      tags
      dateCreation
      dateModification
      datePublication
      auteur {
        id
        email
        nom
        prenom
        
      }
    }
  }
`;
