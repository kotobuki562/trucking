/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import { format } from 'date-fns';
import Link from 'next/link';
import type { VFC } from 'react';
import { memo } from 'react';
import type { Message } from 'src/types/chat';
import useSWR from 'swr';

type Props = {
  id: string;
  message?: string;
  createdAt?: string | Date;
  name: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const RightBar: VFC<Props> = memo((props) => {
  // const { data: messagesInfo } = useSWR(
  //   `http://localhost:3001/messages?chatRoomId=${props.id}`,
  //   fetcher
  // );
  // const messages: Message[] = messagesInfo;

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
            {/* <p className="text-xs">
              {messages !== undefined
                ? messages[messages.length - 1].text.slice(0, 10)
                : null}
              ...
            </p> */}
          </div>
        </div>
      </a>
    </Link>
  );
});
