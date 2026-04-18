import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import App from './App.tsx'

const link = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
