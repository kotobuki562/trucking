/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
import { useUser } from '@auth0/nextjs-auth0';
import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { formatISO } from 'date-fns';
import type { VFC } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MessageBox } from 'src/components/Message';
import { MessageForm } from 'src/components/MessageForm';
import type { Message } from 'src/types/chat';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
type Props = {
  id: string;
};
export const MessagesId: VFC<Props> = memo((props) => {
  const { user } = useUser();

  const messageRef = useRef<HTMLDivElement>(null);
  const handleScrollToBottomOfList = useCallback(() => {
    messageRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messageRef]);
  const { data: messagesInfo } = useSWR(
    `http://localhost:3001/messages?chatRoomId=${props.id}`,
    fetcher
  );
  const { data: roomInfo } = useSWR(
    `http://localhost:3001/chatRoom/${props.id}`,
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
          .post(`http://localhost:3001/chatRoom/${props.id}/messages`, {
            id: uuid + user?.sub,
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
              `http://localhost:3001/messages?chatRoomId=${props.id}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [props.id, oneUserComment, user?.nickname, user?.picture, user?.sub]);

  const handleClickAddOtherUserComment = useCallback(async () => {
    const uuid = uuidv4();
    return otherUserComment === ''
      ? null
      : await axios
          .post(`http://localhost:3001/chatRoom/${props.id}/messages`, {
            id: uuid + 'otherUser',
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
              `http://localhost:3001/messages?chatRoomId=${props.id}`
            );
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [otherUserComment, props.id]);

  useEffect(() => {
    handleScrollToBottomOfList();
  }, [handleScrollToBottomOfList, messages]);

  return (
    <div className="h-full">
      <div className="flex fixed z-10 justify-center items-center pr-14 md:pr-64 w-full h-20 text-base md:text-xl font-semibold dark:text-blue-100 bg-blue-100 dark:bg-blue-800 dark:border-blue-600 shadow">
        <p>#{roomInfo?.roomName}</p>

        <button
          className="flex justify-end p-2 ml-4 text-white bg-blue-300 rounded-full"
          onClick={handleScrollToBottomOfList}>
          <ChevronDoubleDownIcon className="w-4 md:w-6 h-4 md:h-6" />
        </button>
      </div>
      <div className="pt-20 w-full h-full min-h-screen dark:text-blue-100 bg-blue-100 dark:bg-blue-800">
        <div className="w-full">
          {messages?.map((data) => {
            return <MessageBox key={data.id} message={{ ...data }} />;
          })}
        </div>
        <div id="bottom-of-list" className="pt-28" ref={messageRef} />
      </div>
      <div className="fixed bottom-0 pr-14 md:pr-64 w-full bg-blue-100">
        <MessageForm
          onChange={handleChangeOneUserComment}
          value={oneUserComment}
          placeholder={`ログイン中のユーザー${roomInfo?.roomName} へ送信`}
          onClick={handleClickAddOneUserComment}
        />

        <MessageForm
          onChange={handleChangeOtherUserComment}
          value={otherUserComment}
          placeholder={`ゲストユーザー${roomInfo?.roomName} へ送信`}
          onClick={handleClickAddOtherUserComment}
        />
      </div>
    </div>
  );
});
