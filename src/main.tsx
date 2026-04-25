import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { ApolloProvider } from '@apollo/client/react';
import { SetContextLink } from '@apollo/client/link/context'
import './index.css'
import App from './App.tsx'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('token');
  const headers = prevContext.headers || {};
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
