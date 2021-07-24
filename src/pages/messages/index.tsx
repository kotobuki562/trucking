/* eslint-disable react/display-name */
/* eslint-disable no-console */
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

const CreateRooms = () => {
  const { data: chatRooms } = useSWR('http://localhost:3001/chatRoom', fetcher);

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

        <button onClick={handleClickAddPassword}>作成</button>
      </div>
    </Layout>
  );
};

export default withPageAuthRequired(CreateRooms);
