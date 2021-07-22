/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from 'src/components/Layout';
import { MessageBox } from 'src/components/Message';
import type { Message } from 'src/types/chat';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Messages = () => {
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
  const { data: messagesInfo } = useSWR(
    `http://localhost:3001/messages?chatRoomId=${chatRoomId}`,
    fetcher
  );
  const { data: roomInfo } = useSWR(
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
            messages: [],
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
            messages: [],
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
      <div className="h-full">
        <div className="flex justify-center items-center py-5 text-xl font-semibold dark:text-blue-100 bg-blue-100 dark:bg-blue-800 border-b-2 border-blue-200 dark:border-blue-600">
          {roomInfo?.roomName}
        </div>
        <div className="w-full h-full min-h-screen dark:text-blue-100 bg-blue-100 dark:bg-blue-800">
          <div className="w-full">
            {messages?.map((data) => {
              return <MessageBox key={data.id} message={{ ...data }} />;
            })}
          </div>
          <div id="bottom-of-list" className="pt-36" ref={messageRef} />
        </div>
        <div className="fixed bottom-0 w-full bg-blue-100">
          <div className="flex flex-col w-[80%] md:w-[50%]">
            <input
              onChange={handleChangeOneUserComment}
              value={oneUserComment}
              placeholder="oneUser"
              className="p-2 bg-blue-400 rounded-2xl duration-200 focus:outline-none"
            />
            <button onClick={handleClickAddOneUserComment}>onUser</button>
            <button onClick={handleScrollToBottomOfList}>スクロール</button>
          </div>

          <input
            onChange={handleChangeOtherUserComment}
            value={otherUserComment}
            type="text"
            placeholder="otherUser"
            className="p-2 bg-blue-400 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
          />
          <button onClick={handleClickAddOtherUserComment}>otherUser</button>
        </div>
      </div>
    </Layout>
  );
};

export default withPageAuthRequired(Messages);
