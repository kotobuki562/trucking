/* eslint-disable no-console */
/* eslint-disable react/display-name */
import { useUser } from '@auth0/nextjs-auth0';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { format, formatISO } from 'date-fns';
import type { VFC } from 'react';
import { Fragment } from 'react';
import { useCallback, useState } from 'react';
import { memo } from 'react';
import type { Message } from 'src/types/chat';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  message: Message;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const MessageBox: VFC<Props> = memo((props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();
  const { data: messageInfo } = useSWR(
    `http://localhost:3001/messages/${props.message.id}`,
    fetcher
  );
  const message: Message = messageInfo;
  console.log(messageInfo);

  const handleClickCloseThread = useCallback(() => {
    return setIsOpen(false);
  }, []);
  const handleClickOpenThread = useCallback(() => {
    return setIsOpen(true);
  }, []);
  const handleClickSubMessages = useCallback(async () => {
    const uuid = uuidv4();
    await axios
      .patch(`http://localhost:3001/messages/${props.message.id}`, {
        ...message,
        messages: [
          ...message.messages,
          {
            id: uuid,
            userId: user?.sub,
            userName: user?.nickname,
            imageUrl: user?.picture,
            text: 'テスト',
            createdAt: formatISO(new Date()),
          },
        ],
      })
      .then((data) => {
        console.log(data);
        return mutate(`http://localhost:3001/messages/${props.message.id}`);
      })
      .catch((err) => {
        return console.log(err);
      });
  }, [message, props.message.id, user?.nickname, user?.picture, user?.sub]);
  return (
    <div
      className="group w-full hover:bg-blue-50 dark:hover:bg-blue-700 border-b border-blue-200 dark:border-blue-600 duration-200"
      key={props.message.id}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-10"
          onClose={handleClickCloseThread}>
          <div className="px-4 min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-blue-500">
                  {message?.text.slice(0, 20)}...
                </Dialog.Title>
                <div className="overflow-y-scroll mt-2 h-[400px]">
                  {message?.messages?.map((data) => {
                    return (
                      <div
                        key={data.id}
                        className="p-4 hover:bg-blue-50 border-b border-blue-200 duration-200">
                        <div className="flex w-full">
                          <div className="mr-4 min-w-[1.75rem]">
                            <img
                              src={data.imageUrl}
                              alt="My profile"
                              className="w-7 h-7 rounded-full"
                            />
                          </div>
                          <div>
                            <div className="flex items-center mb-2 text-base">
                              <p className="mr-2 font-bold">{data.userName}</p>
                              <p className="text-xs font-semibold text-blue-400">
                                {format(
                                  new Date(data.createdAt),
                                  'yyyy/MM/dd HH:mm'
                                )}
                              </p>
                            </div>
                            <p className="text-sm">{data.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md border border-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:outline-none"
                    onClick={handleClickCloseThread}>
                    Got it, thanks!
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md border border-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:outline-none"
                    onClick={handleClickSubMessages}>
                    テスト
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <div className="p-4">
        <div className="flex w-full">
          <div className="mr-4 min-w-[2.5rem]">
            <img
              src={props.message.imageUrl}
              alt="My profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center mb-4">
              <p className="mr-2 text-lg font-bold">{props.message.userName}</p>
              <p className="text-blue-400">
                {format(new Date(props.message.createdAt), 'yyyy/MM/dd HH:mm')}
              </p>
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  onClick={handleClickOpenThread}
                  className="py-2 px-4 text-sm font-medium text-white bg-black bg-opacity-20 hover:bg-opacity-30 rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus:outline-none">
                  スレッドに参加
                </button>
              </div>
            </div>

            <p>{props.message.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
