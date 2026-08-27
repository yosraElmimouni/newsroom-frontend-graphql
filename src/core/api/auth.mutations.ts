import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        role {
          id
          nomRole
        }
      }
    }
  }
`;

export const MICROSOFT_LOGIN_MUTATION = gql`
  mutation MicrosoftLogin($idToken: String!) {
    microsoftLogin(idToken: $idToken) {
      accessToken
      user {
        id
        email
        role {
          id
          nomRole
        }
      }
    }
  }
`;