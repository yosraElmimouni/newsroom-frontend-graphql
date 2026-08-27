// mutation de l'agenda pour créer un nouvel événement
import { gql, type TypedDocumentNode } from '@apollo/client';
import type { MediaType } from '../../features/capture/types';

export const CREATE_MEDIAS_MUTATION = gql`
  mutation CreateMedia($createMediaInput: CreateMediaInput!) {
    createMedia(createMediaInput: $createMediaInput) {
      id
      type
      urlFichier
      titre
      description
      localisation
      dateCapture
      article {
        id
        titre
      }
      user {
        id
        nom
        prenom
      }
    }
  }
`;


interface MediaFull {
  id: number;
  type: MediaType;
  urlFichier: string;
  titre: string;
  description: string;
  localisation: string;
  dateCapture: string;
  article: {
    id: number;
    titre: string;
  } | null;
  user: {
    id: number;
    nom: string;
    prenom: string;
  };
  
}

interface GetMediasData {
  medias: MediaFull[];
}

export const GET_MEDIAS_QUERY: TypedDocumentNode<GetMediasData> = gql`
  query GetMedias {
    medias {
      id
      type
      urlFichier
      titre
      description
      localisation
      dateCapture
      article {
        id
        titre
      }
      user {
        id
        nom
        prenom
      }
      
    }
  }
`;

export const UPDATE_MEDIA_MUTATION = gql`
  mutation UpdateMedia($updateMediaInput: UpdateMediaInput!) {
    updateMedia(updateMediaInput: $updateMediaInput) {
      id
      type
      urlFichier
      titre
      description
      localisation
      dateCapture
      article {
        id
        titre
      }
      user {
        id
        nom
        prenom
      }
    }
  }
`;

export const DELETE_MEDIA_MUTATION = gql`
  mutation RemoveMedia($id: Int!) {
    removeMedia(id: $id) {
      id
    }
  }
`;

