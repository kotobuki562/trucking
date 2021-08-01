/* eslint-disable no-console */
/* eslint-disable react/display-name */
import { format } from 'date-fns';
import Link from 'next/link';
import type { VFC } from 'react';
import { memo } from 'react';
import type { Message, User } from 'src/types/chat';

type Props = {
  id: string;
  name: string;
  createdAt: string | Date;
  messages: Message[];
  participants: User[];
};

export const ChatRoomCard: VFC<Props> = memo((props) => {
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

          {props.messages !== undefined ? (
            <div className="mb-2">
              <p className="flex relative items-center ml-10 whitespace-pre-wrap">
                {props.messages[0]?.text}
                <span className="absolute top-0 -left-10 px-1 text-xs text-blue-500 bg-yellow-300 rounded-lg">
                  New!
                </span>
              </p>
              <p className="text-blue-400">
                {props.messages.length}件のメッセージ
              </p>
            </div>
          ) : null}
          {props.participants !== undefined ? (
            <p>{props.participants.length}名の参加者</p>
          ) : null}
          <p className="text-right text-blue-400">
            {format(new Date(props.createdAt), 'yyyy年MM月dd日')}
          </p>
        </a>
      </Link>
    </div>
  );
});
