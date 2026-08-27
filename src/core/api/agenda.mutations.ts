// mutation de l'agenda pour créer un nouvel événement
import { gql, type TypedDocumentNode } from '@apollo/client';

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateAgenda($createAgendaInput: CreateAgendaInput!) {
    createAgenda(createAgendaInput: $createAgendaInput) {
      id
      title
      resume
      categorie
      importance
      dateDebut
      dateFin
      lieu
      source {
        id
        nom
        url
      }
    }
  }
`;



// interface ArticleAuteur {
//   id: number;
//   email: string;
//   nom: string;
//   prenom: string;
//   role: string;
// }

interface AgendaFull {
  id: number;
  title: string;
    resume: string;
    categorie: string;  
    importance: string;
    dateDebut: string;
    dateFin: string;
    lieu: string;
    source: {
      id: number;
      nom: string;
      url: string;
    };
}

interface GetAgendaData {
  agendas: AgendaFull[];
}

export const GET_AGENDA_QUERY: TypedDocumentNode<GetAgendaData> = gql`
  query GetAgenda {
    agendas {
       id
      title
      resume
      categorie
      importance
      dateDebut
      dateFin
      lieu
      source{
        id
        nom
        url
      }
      
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateAgenda($updateAgendaInput: UpdateAgendaInput!) {
    updateAgenda(updateAgendaInput: $updateAgendaInput) {
      id
      title
      resume
      categorie
      importance
      dateDebut
      dateFin
      lieu
      source {
        id
        nom
        url
      }
    }
  }
`;

export const DELETE_EVENT_MUTATION = gql`
  mutation RemoveAgenda($id: Int!) {
    removeAgenda(id: $id) {
      id
    }
  }
`;

