import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Role } from '../../features/auth/types';


export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      nom
      prenom
      role{
        id
        nomRole
      }
      dateCreation
    }
  }
`;



export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
        id
        email
        nom
        prenom
        role{
          id
          nomRole
        }   
        dateCreation
        statut
    }
  }
`;


interface USER {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: {
    id: number;
    nomRole: Role;
  };
  dateCreation: string;
  statut?: "ACTIF" | "INACTIF";
}


interface GetUsersData {
  users: USER[];
}

export const GET_USERS_QUERY: TypedDocumentNode<GetUsersData> = gql`
  query GetUsers {
    users {
      id
      email
      nom
      prenom
      role{
        id
        nomRole
      }
      dateCreation
      statut
    }
  }
`;

interface RoleData {
  id: number;
  nomRole: Role;
}

interface GetRolesData {
  roles: RoleData[];
}

export const GET_ROLES_QUERY: TypedDocumentNode<GetRolesData> = gql`
  query GetRoles {
    roles {
      id
      nomRole
    }
  }
`;