import React from 'react';
import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Lottie from 'react-lottie';
import { useUser } from '@auth0/nextjs-auth0';
import * as truckAnime from 'src/animations/truck.json';
import * as locationAnime from 'src/animations/location.json';
import * as messageAnime from 'src/animations/message.json';

const Home = memo(() => {
  const { user } = useUser();
  const router = useRouter();
  const truckDefault = {
    loop: true,
    autoplay: true,
    animationData: truckAnime,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const messageDefault = {
    loop: true,
    autoplay: true,
    animationData: messageAnime,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const locationDefault = {
    loop: true,
    autoplay: true,
    animationData: locationAnime,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    user ? router.push('/dashboard') : null;
  }, [user]);
  return (
    <main className="text-white w-full md:flex">
      <div className="md:w-1/2 h-screen">
        <div className="flex flex-col items-center">
          <div className="w-60 h-60">
            <Lottie options={truckDefault} height="100%" width="100%" />
          </div>
          <div>
            <p className="text-2xl font-semibold">配達状況がまるわかり。</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-60 h-60">
            <Lottie options={locationDefault} height="100%" width="100%" />
          </div>
          <div>
            <p className="text-2xl font-semibold">配達状況をストック。</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-60 h-60">
            <Lottie options={messageDefault} height="100%" width="100%" />
          </div>
          <div>
            <p className="text-2xl font-semibold">なけなしのチャット機能。</p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 h-screen bg-yellow-300 flex flex-col items-center">
        <h2 className="font-semibold text-2xl text-blue-400">
          ちゃちゃっと始めましょう。
        </h2>
      </div>
    </main>
  );
});

export default Home;
