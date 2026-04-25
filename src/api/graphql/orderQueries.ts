import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query MeusPedidos {
    meusPedidos {
      amount
      copyAndPaste
      created_at
      id
      payer_document
      payer_name
      qrcodeImage
      status
      txid
      updated_at
    }
  }
`;