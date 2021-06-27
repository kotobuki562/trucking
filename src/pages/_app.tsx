import '../../styles/index.css';

import { ApolloProvider } from '@apollo/client/react';
import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app';
import React from 'react';

import { apolloClient } from '../apollo/client';
import { ThemeProvider } from 'next-themes';

const App = ({
  Component,
  pageProps,
}: AppProps): React.ReactElement<AppProps> => {
  const { user } = pageProps;
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider user={user}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
