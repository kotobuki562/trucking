module.exports = {
  future: { strictPostcssConfiguration: true },
  i18n: { locales: ['ja'], defaultLocale: 'ja' },
  reactStrictMode: true,
  typescript: { ignoreDevErrors: true },
  poweredByHeader: false,
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET:
      process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
    REACT_APP_HASURA_GRAPHQL_URL: process.env.REACT_APP_HASURA_GRAPHQL_URL,
  },
};
