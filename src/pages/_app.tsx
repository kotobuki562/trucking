import React from 'react';
import '../../styles/index.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '../apollo/client';

const App = ({
  Component,
  pageProps,
}: AppProps): React.ReactElement<AppProps> => {
  const { user } = pageProps;
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider user={user}>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
