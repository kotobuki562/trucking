/* eslint-disable no-console */
/* eslint-disable react/display-name */
import { gql, useSubscription } from '@apollo/client';
import { format } from 'date-fns';
import Link from 'next/link';
import type { VFC } from 'react';
import { memo } from 'react';
import type { Message } from 'src/types/chat';

type Props = {
  id: string;
  name: string;
  createdAt: string | Date;
};

const MESSAGES_SUBSCRIPTION = gql`
  subscription MySubscription($chatRoomId: uuid = chatRoomId) {
    messages(
      order_by: { createdAt: desc }
      where: { chatRoomId: { _eq: $chatRoomId } }
    ) {
      chatRoomId
      text
    }
  }
`;

const USERS_SUBSCRIPTION = gql`
  subscription MySubscription($roomId: uuid = roomId) {
    participants(
      order_by: { createdAt: desc }
      where: { roomId: { _eq: $roomId } }
    ) {
      userId
    }
  }
`;

export const ChatRoomCard: VFC<Props> = memo((props) => {
  const { data: subscribeMessages, loading: isLoading } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    {
      variables: {
        chatRoomId: props.id,
      },
    }
  );
  const { data: subscribeUsers, loading: isLoadingUsers } = useSubscription(
    USERS_SUBSCRIPTION,
    {
      variables: {
        roomId: props.id,
      },
    }
  );
  const users = subscribeUsers?.participants;
  const messages: Message[] = subscribeMessages?.messages;

  return (
    <div>
      <Link href={`/messages/${props.id}`}>
        <a className="hidden sm:block p-4 bg-blue-100 rounded-t-2xl">
          <p className="text-lg font-semibold text-blue-400">#{props.name}</p>
        </a>
      </Link>
      <Link href={`/messages/${props.id}`}>
        <a className="block sm:hidden p-4 w-full text-sm bg-blue-100 hover:bg-blue-200 border-b border-white duration-200">
          <p className="mb-2 text-base font-semibold text-blue-400">
            #{props.name}
          </p>
          {isLoading ? <p>Loading</p> : null}
          {messages !== undefined ? (
            <p className="flex relative items-center mb-2 ml-10 whitespace-pre-wrap">
              {messages[0].text}
              <span className="absolute top-0 -left-10 px-1 text-xs text-blue-500 bg-yellow-300 rounded-lg">
                New!
              </span>
            </p>
          ) : null}
          {isLoadingUsers ? <p>Loading</p> : null}
          {users !== undefined ? <p>{users.length}名の参加者</p> : null}
          <p className="text-right text-blue-400">
            {format(new Date(props.createdAt), 'yyyy年MM月dd日')}
          </p>
        </a>
      </Link>
    </div>
  );
});
