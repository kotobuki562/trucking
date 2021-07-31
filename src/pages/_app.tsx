/* eslint-disable react/destructuring-assignment */
import '../../styles/index.css';

import { ApolloProvider } from '@apollo/client/react';
import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import { apolloClient } from '../apollo/client';

const App = ({
  Component,
  pageProps,
}: AppProps): React.ReactElement<AppProps> => {
  const { user } = pageProps;
  return (
    <UserProvider user={user}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </UserProvider>
  );
};

export default App;
