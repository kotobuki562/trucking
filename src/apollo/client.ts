// import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { createHttpLink } from "@apollo/client";

const hasuraKey = process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET as string;
const hasuraUri = process.env.REACT_APP_HASURA_GRAPHQL_URL as string;

const apolloClient = new ApolloClient({
  headers: {
    'x-hasura-admin-secret': hasuraKey,
  },
  uri: hasuraUri,
  cache: new InMemoryCache(),
});

export { apolloClient };
