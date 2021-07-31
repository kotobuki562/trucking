/* eslint-disable no-console */
/* eslint-disable react/display-name */
import { useUser } from '@auth0/nextjs-auth0';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { format, formatISO } from 'date-fns';
import type { VFC } from 'react';
import { Fragment } from 'react';
import { useCallback, useState } from 'react';
import { memo } from 'react';
import { MessageForm } from 'src/components/MessageForm';
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

  const [oneUserComment, setOneUserComment] = useState('');
  const [otherUserComment, setOtherUserComment] = useState('');
  const handleChangeOneUserComment = useCallback((e) => {
    return setOneUserComment(e.target.value);
  }, []);
  const handleChangeOtherUserComment = useCallback((e) => {
    return setOtherUserComment(e.target.value);
  }, []);

  const handleClickAddOneUserComment = useCallback(async () => {
    const uuid = uuidv4();
    return oneUserComment === ''
      ? null
      : await axios
          .patch(`http://localhost:3001/messages/${props.message.id}`, {
            messages: [
              ...message.messages,
              {
                id: uuid,
                userId: user?.sub,
                userName: user?.nickname,
                imageUrl: user?.picture,
                text: oneUserComment,
                createdAt: formatISO(new Date()),
              },
            ],
          })
          .then((data) => {
            console.log(data);
            setOneUserComment('');
            return mutate(`http://localhost:3001/messages/${props.message.id}`);
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [
    oneUserComment,
    props.message.id,
    message?.messages,
    user?.sub,
    user?.nickname,
    user?.picture,
  ]);

  const handleClickAddOtherUserComment = useCallback(async () => {
    const uuid = uuidv4();
    return otherUserComment === ''
      ? null
      : await axios
          .patch(`http://localhost:3001/messages/${props.message.id}`, {
            messages: [
              ...message.messages,
              {
                id: uuid,
                userId: 'otherUser',
                userName: 'otherUser',
                imageUrl:
                  'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb',
                text: otherUserComment,
                createdAt: formatISO(new Date()),
              },
            ],
          })
          .then((data) => {
            console.log(data);
            setOneUserComment('');
            return mutate(`http://localhost:3001/messages/${props.message.id}`);
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [message?.messages, otherUserComment, props.message.id]);

  const handleClickCloseThread = useCallback(() => {
    return setIsOpen(false);
  }, []);
  const handleClickOpenThread = useCallback(() => {
    return setIsOpen(true);
  }, []);

  return (
    <div
      className="group w-full whitespace-pre-wrap hover:bg-blue-50 dark:hover:bg-blue-700 border-b border-blue-200 dark:border-blue-600 duration-200"
      key={props.message.id}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
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
                  {message?.text?.slice(0, 20)}...
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
                  <MessageForm
                    onChange={handleChangeOneUserComment}
                    value={oneUserComment}
                    placeholder={`ログイン中のユーザー${message?.text} へ送信`}
                    onClick={handleClickAddOneUserComment}
                  />

                  <MessageForm
                    onChange={handleChangeOtherUserComment}
                    value={otherUserComment}
                    placeholder={`ゲストユーザー${message?.text} へ送信`}
                    onClick={handleClickAddOtherUserComment}
                  />
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
              src={props.message?.imageUrl}
              alt="My profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mb-4 w-full">
              <div className="flex items-center">
                <p className="mr-2 text-lg font-bold">{props.message?.name}</p>
                <p className="text-blue-400">
                  {format(
                    new Date(props.message?.createdAt),
                    'yyyy/MM/dd HH:mm'
                  )}
                </p>
              </div>

              <div className="flex justify-center items-center">
                <Menu as="div" className="inline-block relative text-left">
                  <div className="flex items-center">
                    <Menu.Button className="p-1 text-blue-700 bg-blue-200 rounded-full focus:outline-none">
                      <DotsVerticalIcon className="w-5 h-5" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform scale-95">
                    <Menu.Items className="absolute right-0 z-40 mt-2 w-56 bg-white rounded-md divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                      <div className="flex flex-col justify-center py-1 px-1">
                        <Menu.Item>
                          <button
                            type="button"
                            onClick={handleClickOpenThread}
                            className="py-2 px-4 text-sm font-medium text-white bg-black bg-opacity-20 hover:bg-opacity-30 rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus:outline-none">
                            スレッドに参加
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button>text2</button>
                        </Menu.Item>
                      </div>
                      <div className="flex flex-col justify-center py-1 px-1 ">
                        <Menu.Item>
                          <button>test3</button>
                        </Menu.Item>
                        <Menu.Item>
                          <button>More</button>
                        </Menu.Item>
                      </div>
                      <div className="flex flex-col justify-center py-1 px-1 ">
                        <Menu.Item>
                          <button>text4</button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            <p className="mb-2">{props.message?.text}</p>
            {props.message?.messages?.length !== 0 ? (
              <div>
                <button
                  onClick={handleClickOpenThread}
                  className="text-blue-400 hover:text-blue-500 duration-200 focus:outline-none">
                  {props.message?.messages?.length}件の返信
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
