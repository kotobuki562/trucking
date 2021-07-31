import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Layout } from 'src/components/Layout';

const Profile = () => {
  return (
    <Layout>
      <div>Profile</div>
    </Layout>
  );
};

export default withPageAuthRequired(Profile);
