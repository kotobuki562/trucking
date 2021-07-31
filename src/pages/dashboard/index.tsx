import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Layout } from 'src/components/Layout';

export default withPageAuthRequired(() => {
  return (
    <Layout>
      <div className="text-red-500">
        <p>Dashboard</p>
      </div>
    </Layout>
  );
});
