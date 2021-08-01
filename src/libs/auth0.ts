/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { useCallback } from 'react';
import useSWR from 'swr';

export const useSwrUsers = (
  url: string
): { data?: any; error?: any | null } => {
  const swrFetcher = useCallback(async (url: string) => {
    const jwt = await axios.post(
      process.env.AUTH0_MANAGEMENT_CLIENT_URI as string,
      {
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID as string,
        client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET as string,
        audience: `${process.env.AUTH0_MANAGEMENT_CLIENT_AUDIENCE}/`,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      }
    );

    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${jwt.data.access_token as string}`,
      },
    });
    return res.data;
  }, []);
  const { data, error } = useSWR(
    `${process.env.AUTH0_MANAGEMENT_CLIENT_AUDIENCE + url}`,
    swrFetcher
  );

  return { data, error };
};
