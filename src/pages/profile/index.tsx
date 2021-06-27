import React from 'react';
import { Layout } from 'src/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function Profile() {
  return (
    <Layout>
      <div>Profile</div>
    </Layout>
  );
});
