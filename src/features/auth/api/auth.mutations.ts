import { gql } from '@apollo/client';

// Adapte les champs (email/username, structure de retour) à ton resolver Auth réel.
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        role {
          id
          name
        }
      }
    }
  }
`;
