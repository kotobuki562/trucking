/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const hasuraKey = process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET as string;
const hasuraUri = process.env.REACT_APP_HASURA_GRAPHQL_URL as string;
const hasuraWss = process.env.REACT_APP_HASURA_GRAPHQL_WSS as string;

// const httpLink = createHttpLink({
//   uri: hasuraUri,
// });

// const wsLink = new WebSocketLink({
//   uri: hasuraWss,
//   options: {
//     reconnect: true,
//   },
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink as WebSocketLink,
//   httpLink
// );

const apolloClient = new ApolloClient({
  headers: {
    'Hasura-Client-Name': 'hasura-console',
    'x-hasura-admin-secret': hasuraKey,
  },
  uri: hasuraUri,
  // link: splitLink,
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export { apolloClient };
