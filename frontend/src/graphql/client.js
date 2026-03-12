import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

export { client, ApolloProvider };
