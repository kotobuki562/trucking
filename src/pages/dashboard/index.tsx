/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Layout } from 'src/components/Layout';

export default withPageAuthRequired(() => {
  const { data: orderData } = useQuery(GET_ALL_ORDERS);

  console.log(orderData);

  return (
    <Layout>
      <div className="text-red-500">
        <p>Dashboard</p>
      </div>
    </Layout>
  );
});
const GET_ALL_ORDERS = gql`
  query Getorders {
    orders {
      id
      user_id
      number
      itemName
      description
      delivered
      createdAt
      updatedAt
    }
  }
`;
