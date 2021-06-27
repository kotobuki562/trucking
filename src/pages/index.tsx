import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { Layout } from '../components/Layout';
import { memo } from 'react';

const Home = memo(() => {
  const { data: orderData } = useQuery(GET_ALL_ORDERS);

  console.log(orderData);

  return (
    <Layout>
      <div className="text-red-500">
        <p>HOME</p>
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/login">Login</a>
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
export default Home;
