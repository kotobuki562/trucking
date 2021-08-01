/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import { gql, useSubscription } from '@apollo/client';
import { format } from 'date-fns';
import Link from 'next/link';
import type { VFC } from 'react';
import { memo } from 'react';
import type { Message } from 'src/types/chat';

type Props = {
  id: string;
  message?: string;
  createdAt?: string | Date;
  name: string;
};

const MESSAGES_SUBSCRIPTION = gql`
  subscription MySubscription($chatRoomId: uuid = chatRoomId) {
    messages(
      limit: 1
      order_by: { createdAt: desc }
      where: { chatRoomId: { _eq: $chatRoomId } }
    ) {
      chatRoomId
      text
    }
  }
`;

export const RightBar: VFC<Props> = memo((props) => {
  const { data: subscribeMessages, loading: isLoading } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    {
      variables: {
        chatRoomId: props.id,
      },
    }
  );
  const messages: Message[] = subscribeMessages?.messages;
  return (
    <Link href={`/messages/${props.id}`}>
      <a>
        <div className="flex flex-col group-hover:flex-row md:flex-row items-center py-2 group-hover:pl-4 md:pl-4 hover:text-white hover:bg-blue-400 duration-200">
          <div className="group-hover:mr-2 md:mr-2 w-12">
            <div className="flex flex-col justify-center items-center w-12 h-12 text-xl font-semibold text-white bg-blue-400 rounded-full border-4 border-white">
              {props.name.slice(0, 1)}
            </div>
          </div>

          <div className="hidden group-hover:block md:block font-semibold whitespace-nowrap">
            <p>{props.name.slice(0, 8)}...</p>
            <p className="text-xs">{props.message}</p>
            {props.createdAt !== undefined ? (
              <p className="text-xs">
                {format(new Date(props.createdAt), 'MM月dd日 HH:mm')}
              </p>
            ) : null}
            <p className="text-xs">
              {messages && messages[0]?.text !== undefined
                ? `${messages[0].text.slice(0, 10)}...`
                : null}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
});
