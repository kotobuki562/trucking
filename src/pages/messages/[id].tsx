/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { Layout } from 'src/components/Layout';
import { MessagesId } from 'src/components/templates/Message';

const Messages = () => {
  const router = useRouter();
  const chatRoomId = router.query.id as string;
  return (
    <Layout>
      <MessagesId id={chatRoomId} />
    </Layout>
  );
};

export default withPageAuthRequired(Messages);
