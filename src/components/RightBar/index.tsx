import Link from 'next/link';
import React, { memo, VFC } from 'react';
import type { ChatRoom } from 'src/types/chat';
import { format } from 'date-fns';

export const RightBar: VFC<ChatRoom> = memo((props) => {
  return (
    <Link href={`/messages/${props.id}`}>
      <a>
        <div className="flex flex-col items-center group-hover:pl-4 md:pl-4 group-hover:flex-row md:flex-row duration-200 py-2 hover:bg-blue-400 hover:text-white">
          <div className="w-12 group-hover:mr-2 md:mr-2">
            <div className="flex flex-col items-center justify-center w-12 h-12 text-xl text-white font-semibold border-4 border-white bg-blue-400 rounded-full">
              {props.roomName.slice(0, 1)}
            </div>
          </div>

          <div className="hidden group-hover:block md:block whitespace-nowrap font-semibold">
            <p>{props.roomName.slice(0, 8)}...</p>
            <p className="text-xs">
              {props.messages[props.messages.length - 1].text}
            </p>
            <p className="text-xs">
              {format(
                new Date(props.messages[props.messages.length - 1].createdAt),
                'MM月dd日 HH:mm'
              )}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
});
