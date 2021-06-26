import React from 'react';
import { memo } from 'react';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';

const Home = memo(() => {
  const { data: orderData } = useQuery(GET_ALL_ORDERS);
  const { user } = useUser();
  console.log(user);

  console.log(orderData);

  return (
    <div className="text-red-500">
      <p>HOME</p>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/login">Login</a>
    </div>
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
