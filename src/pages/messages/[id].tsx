import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  MutableRefObject,
} from 'react';
import { Layout } from 'src/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@auth0/nextjs-auth0';
import type { ChatRoom, Message } from 'src/types/chat';
import { format, formatISO } from 'date-fns';
import { RightBar } from 'src/components/RightBar';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default withPageAuthRequired(function Message() {
  const { user } = useUser();
  const router = useRouter();
  const chatRoomId = router.query.id as string;
  const messageRef = useRef<HTMLDivElement>(null);
  const scrollToBottomOfList = useCallback(() => {
    messageRef!.current!.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messageRef]);
  const { data: chatRoomsInfo } = useSWR(
    'http://localhost:3001/chatRoom',
    fetcher
  );
  const { data: messagesInfo } = useSWR(
    `http://localhost:3001/messages?roomId=${chatRoomId}`
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
              `http://localhost:3001/messages?roomId=${chatRoomId}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [oneUserComment]);

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
              `http://localhost:3001/messages?roomId=${chatRoomId}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [otherUserComment]);

  useEffect(() => {
    scrollToBottomOfList();
  }, [messages]);

  return (
    <Layout>
      <div className="group overflow-y-scroll hover:w-64 w-14 md:w-64 h-screen fixed duration-300 right-0 rounded-l-2xl border-white bg-blue-300">
        {chatRooms?.map((room) => {
          return <RightBar key={room.id} {...room} />;
        })}
      </div>

      <div className="p-8 h-full mr-14 md:mr-64">
        <div className="bg-blue-100 overflow-y-scroll rounded-2xl h-full">
          <div className="w-full px-4">
            {messages?.map((data) => {
              if (data.userId === `${user?.sub}`) {
                return (
                  <div
                    key={data.id}
                    className="flex items-end justify-end py-2">
                    <div className="flex flex-col text-xs md:text-base max-w-xs mx-2 order-1 items-end">
                      <p className="text-right">{data.userName}</p>
                      <span className="px-4 break-all py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                        {data.text}
                      </span>
                      <p className="text-right">
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
                  <div key={data.id} className="flex items-end py-2">
                    <div className="flex flex-col text-xs md:text-base max-w-xs mx-2 order-2 items-start">
                      <p className="text-left">{data.userName}</p>
                      <span className="px-4 py-2 break-all rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                        {data.text}
                      </span>
                      <p className="text-left">
                        {format(new Date(data.createdAt), 'HH:mm') || 'none'}
                      </p>
                    </div>
                    <img
                      src={data.imageUrl}
                      alt="My profile"
                      className="w-10 h-10 rounded-full order-1"
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
        <button onClick={scrollToBottomOfList}>スクロール</button>
        <div id="bottom-of-list" ref={messageRef} />
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
