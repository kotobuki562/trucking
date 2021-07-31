/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const hasuraKey = process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET as string;
const hasuraUri = process.env.REACT_APP_HASURA_GRAPHQL_URL as string;
const hasuraWss = process.env.REACT_APP_HASURA_GRAPHQL_WSS as string;

const httpLink = new HttpLink({
  headers: {
    'Hasura-Client-Name': 'hasura-console',
    'x-hasura-admin-secret': hasuraKey,
  },
  uri: hasuraUri,
});

const wsLink = process.browser
  ? new WebSocketLink({
      uri: hasuraWss,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            'Hasura-Client-Name': 'hasura-console',
            'x-hasura-admin-secret': hasuraKey,
          },
        },
      },
    })
  : undefined;

const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink as WebSocketLink,
      httpLink
    )
  : httpLink;

const apolloClient = new ApolloClient({
  headers: {
    'Hasura-Client-Name': 'hasura-console',
    'x-hasura-admin-secret': hasuraKey,
  },
  uri: hasuraUri,
  link: splitLink,
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
});

export { apolloClient };
