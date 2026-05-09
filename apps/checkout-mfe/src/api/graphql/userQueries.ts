import { gql } from '@apollo/client';

export const GET_USER = gql`
  query UserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      name
      dica_senha
    }
  }
`;