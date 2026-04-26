/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateUserInput = {
  dicaSenha: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: Users;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type Order = {
  __typename?: 'Order';
  amount: Scalars['String']['output'];
  copyAndPaste: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  payer_document?: Maybe<Scalars['String']['output']>;
  payer_name?: Maybe<Scalars['String']['output']>;
  qrcodeImage: Scalars['String']['output'];
  status: Scalars['String']['output'];
  txid: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  user: Users;
};

export type Query = {
  __typename?: 'Query';
  /** Retorna a lista de pedidos do usuário autenticado, ordenados do mais recente para o mais antigo. */
  meusPedidos: Array<Order>;
  userByUsername?: Maybe<Users>;
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type Users = {
  __typename?: 'Users';
  dica_senha: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  orders?: Maybe<Array<Order>>;
};

export type MeusPedidosQueryVariables = Exact<{ [key: string]: never; }>;


export type MeusPedidosQuery = { __typename?: 'Query', meusPedidos: Array<{ __typename?: 'Order', amount: string, copyAndPaste: string, created_at: any, id: number, payer_document?: string | null, payer_name?: string | null, qrcodeImage: string, status: string, txid: string, updated_at: any }> };

export type UserByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type UserByUsernameQuery = { __typename?: 'Query', userByUsername?: { __typename?: 'Users', id: number, name: string, dica_senha: string } | null };


export const MeusPedidosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeusPedidos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meusPedidos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"copyAndPaste"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payer_document"}},{"kind":"Field","name":{"kind":"Name","value":"payer_name"}},{"kind":"Field","name":{"kind":"Name","value":"qrcodeImage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"txid"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<MeusPedidosQuery, MeusPedidosQueryVariables>;
export const UserByUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserByUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userByUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dica_senha"}}]}}]}}]} as unknown as DocumentNode<UserByUsernameQuery, UserByUsernameQueryVariables>;