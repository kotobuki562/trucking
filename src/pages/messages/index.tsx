import React from 'react';
import { Layout } from 'src/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function Messages() {
  return (
    <Layout>
      <div>Messages</div>
    </Layout>
  );
});
