/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import axios from 'axios';
import cc from 'classcat';
import { formatISO } from 'date-fns';
import type { VFC } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ADD_MESSAGE } from 'src/apollo/schema';
import { MessageBox } from 'src/components/Message';
import { MessageForm } from 'src/components/MessageForm';
import type { ChatRoom, Message } from 'src/types/chat';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  id: string;
};

const GET_CHATROOM = gql`
  query MyQuery($id: uuid = id) {
    chatRooms_by_pk(id: $id) {
      name
      id
      createrId
      createdAt
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription MySubscription($chatRoomId: uuid = chatRoomId) {
    messages(where: { chatRoomId: { _eq: $chatRoomId } }) {
      chatRoomId
      text
      name
      createdAt
      imageUrl
      messages
    }
  }
`;

export const MessagesId: VFC<Props> = memo((props) => {
  const { user } = useUser();
  const { data: chatRoom } = useQuery(GET_CHATROOM, {
    variables: {
      id: props.id,
    },
  });
  const room: ChatRoom = chatRoom?.chatRooms_by_pk;
  console.log(room);
  const [addMessage] = useMutation(ADD_MESSAGE);
  const { data: subscribeMessages, loading: isLoadingMessages } =
    useSubscription(MESSAGES_SUBSCRIPTION, {
      variables: {
        chatRoomId: props.id,
      },
    });
  const messages: Message[] = subscribeMessages?.messages;
  console.log(messages);

  const messageRef = useRef<HTMLDivElement>(null);
  const handleScrollToBottomOfList = useCallback(() => {
    messageRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messageRef]);

  const [oneUserComment, setOneUserComment] = useState('');
  const [otherUserComment, setOtherUserComment] = useState('');
  const handleChangeOneUserComment = useCallback((e) => {
    return setOneUserComment(e.target.value);
  }, []);
  const handleChangeOtherUserComment = useCallback((e) => {
    return setOtherUserComment(e.target.value);
  }, []);

  const handleClickAddOneUserComment = useCallback(async () => {
    return oneUserComment === ''
      ? null
      : await addMessage({
          variables: {
            chatRoomId: props.id,
            userId: user?.sub,
            name: user?.nickname,
            imageUrl: user?.picture,
            text: oneUserComment,
            createdAt: formatISO(new Date()),
            messages: [],
          },
        })
          .then((data) => {
            console.log(data);
            setOneUserComment('');
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [
    oneUserComment,
    addMessage,
    props.id,
    user?.sub,
    user?.nickname,
    user?.picture,
  ]);

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
        <p>#{room?.name}</p>

        <button
          className="flex justify-end p-2 ml-4 text-white bg-blue-300 rounded-full"
          onClick={handleScrollToBottomOfList}>
          <ChevronDoubleDownIcon className="w-4 md:w-6 h-4 md:h-6" />
        </button>
      </div>
      <div
        className={cc([
          'pt-20 w-full h-full min-h-screen dark:text-blue-100 bg-blue-100 dark:bg-blue-800',
          isLoadingMessages === true ? 'animate-pulse' : null,
        ])}>
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
          placeholder={`ログイン中のユーザー${room?.name} へ送信`}
          onClick={handleClickAddOneUserComment}
        />

        <MessageForm
          onChange={handleChangeOtherUserComment}
          value={otherUserComment}
          placeholder={`ゲストユーザー${room?.name} へ送信`}
          onClick={handleClickAddOtherUserComment}
        />
      </div>
    </div>
  );
});
