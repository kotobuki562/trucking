/* eslint-disable no-console */
/* eslint-disable react/display-name */
import { gql, useMutation } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { format, formatISO } from 'date-fns';
import type { VFC } from 'react';
import { Fragment } from 'react';
import { useCallback, useState } from 'react';
import { memo } from 'react';
import { SubMessageBox } from 'src/components/Message/subMessage';
import type { Message } from 'src/types/chat';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  message: Message;
};

const ADD_SUBMESSAGE = gql`
  mutation MyMutation(
    $id: uuid = id
    $messages: json = [
      { id: id, name: name, imageUrl: imageUrl, createdAt: createdAt }
    ]
  ) {
    update_messages_by_pk(
      pk_columns: { id: $id }
      _set: { messages: $messages }
    ) {
      messages
    }
  }
`;

export const MessageBox: VFC<Props> = memo((props) => {
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();
  const [addSubMessage] = useMutation(ADD_SUBMESSAGE, {
    onCompleted: () => {
      return setText('');
    },
  });

  const handleChangeText = useCallback((e) => {
    return setText(e.target.value);
  }, []);

  const handleClickAddOneUserComment = useCallback(async () => {
    return text === ''
      ? null
      : await addSubMessage({
          variables: {
            id: props.message.id,
            messages: [
              ...props.message.messages,
              {
                id: uuidv4(),
                userId: user?.sub,
                name: user?.name,
                imageUrl: user?.picture,
                text: text,
                createdAt: formatISO(new Date()),
              },
            ],
          },
        })
          .then((data) => {
            return console.log(data);
          })
          .catch((error) => {
            return console.log(error);
          });
  }, [
    text,
    addSubMessage,
    props.message.id,
    props.message.messages,
    user?.sub,
    user?.name,
    user?.picture,
  ]);

  const handleClickCloseThread = useCallback(() => {
    return setIsOpen(false);
  }, []);
  const handleClickOpenThread = useCallback(() => {
    return setIsOpen(true);
  }, []);

  return (
    <div
      className="group w-full text-sm sm:text-base whitespace-pre-wrap hover:bg-blue-50 dark:hover:bg-blue-700 border-b border-blue-200 dark:border-blue-600 duration-200"
      key={props.message.id}>
      <SubMessageBox
        show={isOpen}
        onChange={handleChangeText}
        onClick={handleClickAddOneUserComment}
        onClose={handleClickCloseThread}
        value={text}
        title={props.message.text}
        messages={props.message.messages}
      />
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
              <div className="flex flex-col">
                <p className="text-base sm:text-lg font-bold">
                  {props.message?.name}
                </p>
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
