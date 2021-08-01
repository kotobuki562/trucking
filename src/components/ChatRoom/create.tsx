/* eslint-disable react/display-name */
import { gql, useMutation } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { Dialog, Transition } from '@headlessui/react';
import { HashtagIcon } from '@heroicons/react/solid';
import { formatISO } from 'date-fns';
import { Fragment, memo, useCallback, useState } from 'react';
import { ADD_MESSAGE } from 'src/apollo/schema';

const ADD_PARTICIPANTS = gql`
  mutation CreateParticipants(
    $userId: String!
    $roomId: uuid
    $createdAt: String!
  ) {
    insert_participants_one(
      object: { userId: $userId, roomId: $roomId, createdAt: $createdAt }
    ) {
      id
      userId
      roomId
      createdAt
    }
  }
`;

const ADD_CHATROOM = gql`
  mutation MyMutation(
    $createdAt: String!
    $createrId: String!
    $name: String!
    $password: String!
  ) {
    insert_chatRooms_one(
      object: {
        createdAt: $createdAt
        createrId: $createrId
        name: $name
        password: $password
      }
    ) {
      id
      createdAt
      createrId
      name
      password
    }
  }
`;
export const CreateChatRoom = memo(() => {
  const [addChatRoom] = useMutation(ADD_CHATROOM, {
    onCompleted: () => {
      setPassword('');
      setRoomName('');
      setText('');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addMessage] = useMutation(ADD_MESSAGE);
  const [addPrticipants] = useMutation(ADD_PARTICIPANTS);
  const { user } = useUser();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const handleClickOpen = useCallback(() => {
    return setIsModal(true);
  }, []);
  const handleClickClose = useCallback(() => {
    return setIsModal(false);
  }, []);
  const handleChangePassword = useCallback((e) => {
    return setPassword(e.target.value);
  }, []);
  const handleChangeRoomName = useCallback((e) => {
    return setRoomName(e.target.value);
  }, []);
  const handleChangeText = useCallback((e) => {
    return setText(e.target.value);
  }, []);

  const handleClickCreateRoom = useCallback(async () => {
    if (!roomName || !password || !user?.sub) {
      return null;
    } else {
      return await addChatRoom({
        variables: {
          createrId: user?.sub,
          password: password,
          name: roomName,
          createdAt: formatISO(new Date()),
          users: [
            {
              id: `${user?.sub}`,
              name: `${user?.nickname}`,
              imageUrl: `${user?.picture}`,
              createdAt: formatISO(new Date()),
            },
          ],
        },
      })
        .then(async (result) => {
          const chatRoomId = await result.data.insert_chatRooms_one.id;
          await addPrticipants({
            variables: {
              roomId: chatRoomId as string,
              userId: user?.sub,
              createdAt: formatISO(new Date()),
            },
          });

          return await addMessage({
            variables: {
              chatRoomId: chatRoomId as string,
              userId: user?.sub,
              name: user?.nickname,
              imageUrl: user?.picture,
              text: text,
              createdAt: formatISO(new Date()),
              messages: [],
            },
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          return console.log(error);
        });
    }
  }, [
    addChatRoom,
    addMessage,
    addPrticipants,
    password,
    roomName,
    text,
    user?.nickname,
    user?.picture,
    user?.sub,
  ]);

  return (
    <div>
      <button
        type="button"
        onClick={handleClickOpen}
        className="p-2 text-white bg-yellow-300 hover:bg-yellow-200 rounded-full duration-200 focus:outline-none">
        <HashtagIcon className="w-6 sm:w-10 h-6 sm:h-10" />
      </button>
      <Transition appear show={isModal} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={handleClickClose}>
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
                  チャットルームを作成
                </Dialog.Title>
                <div className="overflow-y-scroll mt-2 h-full">
                  <div>
                    <div className="rounded-2xl">
                      <div className="p-4 w-full">
                        <div className="mb-4">
                          <input
                            onChange={handleChangePassword}
                            value={password}
                            type="text"
                            placeholder="合言葉を設定してください"
                            className="p-2 w-full bg-blue-100 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
                          />
                        </div>

                        <div className="mb-4">
                          <input
                            onChange={handleChangeRoomName}
                            value={roomName}
                            type="text"
                            placeholder="ルーム名を設定してください"
                            className="p-2 w-full bg-blue-100 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            onChange={handleChangeText}
                            value={text}
                            type="text"
                            placeholder="最初の一言"
                            className="p-2 w-full bg-blue-100 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button onClick={handleClickCreateRoom}>Mutation</button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
});
