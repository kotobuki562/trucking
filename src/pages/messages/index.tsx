/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
import { gql, useMutation, useSubscription } from '@apollo/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useCallback, useState } from 'react';
import { Layout } from 'src/components/Layout';
import { RightBar } from 'src/components/RightBar';
import type { ChatRoom } from 'src/types/chat';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const CHATROOM_SUBSCRIPTION = gql`
  subscription MySubscription {
    chatRooms {
      createdAt
      createrId
      id
      name
      password
      users
    }
  }
`;

const ADD_CHATROOM = gql`
  mutation MyMutation(
    $createdAt: String!
    $createrId: String!
    $name: String!
    $password: String!
    $users: json = [
      { id: id, name: name, imageUrl: imageUrl, createdAt: createdAt }
    ]
  ) {
    insert_chatRooms_one(
      object: {
        createdAt: $createdAt
        createrId: $createrId
        name: $name
        password: $password
        users: $users
      }
    ) {
      id
      createdAt
      createrId
      name
      password
      users
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation MyMutation(
    $chatRoomId: uuid
    $createdAt: String!
    $imageUrl: String!
    $name: String!
    $text: String!
    $userId: String!
  ) {
    insert_messages_one(
      object: {
        chatRoomId: $chatRoomId
        createdAt: $createdAt
        imageUrl: $imageUrl
        messages: []
        name: $name
        text: $text
        userId: $userId
      }
    ) {
      chatRoomId
      userId
      text
      name
      messages
      imageUrl
      createdAt
    }
  }
`;

const CreateRooms = () => {
  const { data: subscriptionChatRoom } = useSubscription(CHATROOM_SUBSCRIPTION);
  console.log(subscriptionChatRoom);

  const { data: chatRooms } = useSWR('http://localhost:3001/chatRoom', fetcher);
  const [addChatRoom] = useMutation(ADD_CHATROOM, {
    onCompleted: () => {
      setPassword('');
      setRoomName('');
      setText('');
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addMessage] = useMutation(ADD_MESSAGE);
  const { user } = useUser();
  const uuid = uuidv4();
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
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
          console.log(result.data);
          const chatRoomId = await result.data.insert_chatRooms_one.id;
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
            // refetchQueries: [
            //   {
            //     query: CHATROOM_SUBSCRIPTION,
            //   },
            // ],
          })
            .then((result) => {
              return console.log(result.data);
            })
            .catch((err) => {
              return console.log(err);
            });
        })
        .catch((error) => {
          return console.log(error);
        });
    }
  }, [
    addChatRoom,
    addMessage,
    password,
    roomName,
    text,
    user?.nickname,
    user?.picture,
    user?.sub,
  ]);

  const handleClickAddPassword = useCallback(async () => {
    await axios
      .post('http://localhost:3001/chatRoom', {
        id: uuid,
        createrId: user?.sub,
        password: password,
        roomName: roomName,
        createdAt: formatISO(new Date()),
        users: [
          {
            id: user?.sub,
            name: user?.nickname,
            imageUrl: user?.picture,
            createdAt: formatISO(new Date()),
          },
        ],
      })
      .then((data) => {
        setPassword('');
        setRoomName('');
        setText('');
        console.log(data);
        const messageUuid = uuidv4();
        axios.post(`http://localhost:3001/chatRoom/${data.data.id}/messages`, {
          id: messageUuid + user?.sub,
          userId: user?.sub,
          userName: user?.nickname,
          imageUrl: user?.picture,
          text: text,
          createdAt: formatISO(new Date()),
          messages: [],
        });
        return mutate('http://localhost:3001/chatRoom');
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [
    password,
    roomName,
    text,
    user?.nickname,
    user?.picture,
    user?.sub,
    uuid,
  ]);

  const arrayChatRoom: ChatRoom[] = chatRooms;
  return (
    <Layout>
      <div className="group overflow-y-scroll fixed right-0 w-14 hover:w-64 md:w-64 h-screen bg-blue-300 rounded-l-2xl duration-300">
        {arrayChatRoom?.map((room) => {
          return <RightBar key={room.id} {...room} />;
        })}
      </div>
      <div className="p-8 mr-14 md:mr-64 h-full">
        <div className="bg-blue-100 rounded-2xl">
          <div className="p-4 w-full">
            <div className="mb-4">
              <input
                onChange={handleChangePassword}
                value={password}
                type="text"
                placeholder="合言葉を設定してください"
                className="p-2 w-full bg-blue-300 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <input
                onChange={handleChangeRoomName}
                value={roomName}
                type="text"
                placeholder="ルーム名を設定してください"
                className="p-2 w-full bg-blue-300 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
              />
            </div>
            <div>
              <input
                onChange={handleChangeText}
                value={text}
                type="text"
                placeholder="最初の一言"
                className="p-2 w-full bg-blue-300 rounded-2xl focus:ring-4 ring-blue-200 duration-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <button onClick={handleClickCreateRoom}>Mutation</button>
        <button onClick={handleClickAddPassword}>作成</button>
      </div>
    </Layout>
  );
};

export default withPageAuthRequired(CreateRooms);
