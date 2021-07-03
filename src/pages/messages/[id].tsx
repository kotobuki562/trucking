import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Layout } from 'src/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@auth0/nextjs-auth0';
import type { ChatRoom } from 'src/types/chat';
import { format, formatISO } from 'date-fns';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default withPageAuthRequired(function Message() {
  const { user } = useUser();
  const router = useRouter();
  const chatRoomId = router.query.id as string;
  const { data: images } = useSWR(
    'https://jsonplaceholder.typicode.com/photos',
    fetcher
  );
  const { data: chatRoomInfo } = useSWR(
    `http://localhost:3001/chatRoom/${chatRoomId}`,
    fetcher
  );
  const [oneUserComment, setOneUserComment] = useState('');
  const [otherUserComment, setOtherUserComment] = useState('');
  const handleChangeOneUserComment = useCallback((e) => {
    return setOneUserComment(e.target.value);
  }, []);
  const handleChangeOtherUserComment = useCallback((e) => {
    return setOtherUserComment(e.target.value);
  }, []);

  const arrayImages: any[] = images;
  const chatRoom: ChatRoom = chatRoomInfo;
  const limitImages = arrayImages?.slice(0, 30);

  const handleClickAddOneUserComment = useCallback(async () => {
    const uuid = uuidv4();
    await axios
      .patch(`http://localhost:3001/chatRoom/${chatRoomId}`, {
        messages: [
          ...chatRoom.messages,
          {
            id: uuid,
            userId: user?.sub,
            text: oneUserComment,
            createdAt: formatISO(new Date()),
          },
        ],
      })
      .then((data) => {
        console.log(data);
        setOneUserComment('');
        return mutate(`http://localhost:3001/chatRoom/${chatRoomId}`);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [oneUserComment]);

  const handleClickAddOtherUserComment = useCallback(async () => {
    const uuid = uuidv4();
    await axios
      .patch(`http://localhost:3001/chatRoom/${chatRoomId}`, {
        messages: [
          ...chatRoom.messages,
          {
            id: uuid,
            userId: 'otherUser',
            text: otherUserComment,
            createdAt: formatISO(new Date()),
          },
        ],
      })
      .then((data) => {
        console.log(data);
        setOtherUserComment('');
        return mutate(`http://localhost:3001/chatRoom/${chatRoomId}`);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [otherUserComment]);

  return (
    <Layout>
      <div className="group overflow-y-scroll hover:w-64 w-14 md:w-64 h-screen fixed duration-300 right-0 rounded-l-2xl hover:border-l-4 hover:border-t-4 md:border-l-4 md:border-t-4 border-white bg-blue-300">
        {limitImages?.map((image: any) => {
          return (
            <Link href="/" key={image.id}>
              <a>
                <div className="flex flex-col items-center group-hover:pl-4 md:pl-4 group-hover:flex-row md:flex-row duration-200 py-2 hover:bg-blue-400 hover:text-white">
                  <img
                    className="w-12 h-12 border-4 border-blue-400 group-hover:mr-2 md:mr-2 rounded-full"
                    src={image.thumbnailUrl}
                    alt={image.title}
                  />
                  <p className="hidden group-hover:block md:block font-semibold">
                    {image.title.slice(0, 15)}
                  </p>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
      <div className="p-8 h-full mr-14 md:mr-64">
        <div className="scrollContent bg-blue-100 overflow-y-scroll rounded-2xl h-[500px]">
          <div className="w-full p-4">
            {chatRoom?.messages?.map((data) => {
              if (data.userId === `${user?.sub}`) {
                return (
                  <div
                    id={data.id}
                    key={data.id}
                    className="flex area items-end justify-end py-2">
                    <div className="flex flex-col space-y-2 text-xs md:text-base max-w-xs mx-2 order-1 items-end">
                      <div className="break-all">
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                          {data.text}
                        </span>
                      </div>
                      <p>
                        {format(new Date(data.createdAt), 'HH:mm') || 'none'}
                      </p>
                    </div>
                    <img
                      src={`${user?.picture}`}
                      alt="My profile"
                      className="w-10 h-10 rounded-full order-2"
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    id={data.id}
                    key={data.id}
                    className="flex area items-end py-2">
                    <div className="flex flex-col space-y-2 text-xs md:text-base max-w-xs mx-2 order-2 items-start">
                      <div className="break-all">
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {data.text}
                        </span>
                      </div>
                      <p>
                        {format(new Date(data.createdAt), 'HH:mm') || 'none'}
                      </p>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                      alt="My profile"
                      className="w-7 h-7 md:w-10 md:h-10 rounded-full order-1"
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
        <input
          onChange={handleChangeOneUserComment}
          value={oneUserComment}
          type="text"
          placeholder="oneUser"
          className="w-full p-2 bg-blue-300 rounded-2xl focus:outline-none focus:ring-4 ring-blue-200 duration-200"
        />
        <button onClick={handleClickAddOneUserComment}>onUser</button>
        <input
          onChange={handleChangeOtherUserComment}
          value={otherUserComment}
          type="text"
          placeholder="otherUser"
          className="w-full p-2 bg-blue-300 rounded-2xl focus:outline-none focus:ring-4 ring-blue-200 duration-200"
        />
        <button onClick={handleClickAddOtherUserComment}>otherUser</button>
      </div>
    </Layout>
  );
});
