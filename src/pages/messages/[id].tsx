/* eslint-disable no-console */
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { format, formatISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from 'src/components/Layout';
import { RightBar } from 'src/components/RightBar';
import type { ChatRoom, Message } from 'src/types/chat';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default withPageAuthRequired(() => {
  const { user } = useUser();
  const router = useRouter();
  const chatRoomId = router.query.id as string;
  const messageRef = useRef<HTMLDivElement>(null);
  const handleScrollToBottomOfList = useCallback(() => {
    messageRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messageRef]);
  const { data: chatRoomsInfo } = useSWR(
    'http://localhost:3001/chatRoom',
    fetcher
  );
  const { data: messagesInfo } = useSWR(
    `http://localhost:3001/messages?chatRoomId=${chatRoomId}`
  );
  const [oneUserComment, setOneUserComment] = useState('');
  const [otherUserComment, setOtherUserComment] = useState('');
  const handleChangeOneUserComment = useCallback((e) => {
    return setOneUserComment(e.target.value);
  }, []);
  const handleChangeOtherUserComment = useCallback((e) => {
    return setOtherUserComment(e.target.value);
  }, []);

  const chatRooms: ChatRoom[] = chatRoomsInfo;
  const messages: Message[] = messagesInfo;

  const handleClickAddOneUserComment = useCallback(async () => {
    const uuid = uuidv4();
    return oneUserComment === ''
      ? null
      : await axios
          .post(`http://localhost:3001/chatRoom/${chatRoomId}/messages`, {
            id: uuid,
            userId: user?.sub,
            userName: user?.nickname,
            imageUrl: user?.picture,
            text: oneUserComment,
            createdAt: formatISO(new Date()),
          })
          .then((data) => {
            console.log(data);
            setOneUserComment('');
            return mutate(
              `http://localhost:3001/messages?chatRoomId=${chatRoomId}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [chatRoomId, oneUserComment, user?.nickname, user?.picture, user?.sub]);

  const handleClickAddOtherUserComment = useCallback(async () => {
    const uuid = uuidv4();
    return otherUserComment === ''
      ? null
      : await axios
          .post(`http://localhost:3001/chatRoom/${chatRoomId}/messages`, {
            id: uuid,
            userId: 'otherUser',
            userName: 'otherUser',
            imageUrl:
              'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb',
            text: otherUserComment,
            createdAt: formatISO(new Date()),
          })
          .then((data) => {
            console.log(data);
            setOtherUserComment('');
            return mutate(
              `http://localhost:3001/messages?chatRoomId=${chatRoomId}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [chatRoomId, otherUserComment]);

  useEffect(() => {
    handleScrollToBottomOfList();
  }, [handleScrollToBottomOfList, messages]);

  return (
    <Layout>
      <div className="group overflow-y-scroll fixed w-14 hover:w-64 md:w-64 h-screen bg-blue-300 duration-300">
        {chatRooms?.map((room) => {
          return (
            <RightBar id={room.id} key={room.id} roomName={room.roomName} />
          );
        })}
      </div>

      <div className="ml-14 md:ml-64 h-full">
        <div className="w-full h-full bg-blue-100">
          <div className="px-4 w-full">
            {messages?.map((data) => {
              if (data.userId === `${user?.sub}`) {
                return (
                  <div
                    key={data.id}
                    className="flex justify-end items-end py-2">
                    <div className="flex flex-col order-1 items-end mx-2 max-w-xs text-xs md:text-base">
                      <p className="text-right">{data.userName}</p>
                      <span className="inline-block py-2 px-4 text-white break-all bg-blue-600 rounded-lg rounded-br-none">
                        {data.text}
                      </span>
                      <p className="text-right">
                        {format(new Date(data.createdAt), 'MM/dd HH:mm')}
                      </p>
                    </div>
                    <img
                      src={`${user?.picture}`}
                      alt="My profile"
                      className="order-2 w-10 h-10 rounded-full"
                    />
                  </div>
                );
              } else {
                return (
                  <div key={data.id} className="flex items-end py-2">
                    <div className="flex flex-col order-2 items-start mx-2 max-w-xs text-xs md:text-base">
                      <p className="text-left">{data.userName}</p>
                      <span className="inline-block py-2 px-4 text-gray-600 break-all bg-gray-300 rounded-lg rounded-bl-none">
                        {data.text}
                      </span>
                      <p className="text-left">
                        {format(new Date(data.createdAt), 'MM/dd HH:mm')}
                      </p>
                    </div>
                    <img
                      src={data.imageUrl}
                      alt="My profile"
                      className="order-1 w-10 h-10 rounded-full"
                    />
                  </div>
                );
              }
            })}
          </div>
          <div id="bottom-of-list" className="pt-36" ref={messageRef} />
        </div>
        <div className="fixed bottom-0 w-full">
          <input
            onChange={handleChangeOneUserComment}
            value={oneUserComment}
            placeholder="oneUser"
            className="p-2 w-full bg-blue-400 rounded-2xl duration-200 focus:outline-none"
          />
          <button onClick={handleClickAddOneUserComment}>onUser</button>
          <button onClick={handleScrollToBottomOfList}>スクロール</button>

          <input
            onChange={handleChangeOtherUserComment}
            value={otherUserComment}
            type="text"
            placeholder="otherUser"
            className="p-2 w-full bg-blue-400 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
          />
          <button onClick={handleClickAddOtherUserComment}>otherUser</button>
        </div>
      </div>
    </Layout>
  );
});
