import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Layout } from 'src/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@auth0/nextjs-auth0';
import type { ChatRoom } from 'src/types/chat';
import { formatISO } from 'date-fns';
import { RightBar } from 'src/components/RightBar';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default withPageAuthRequired(function Messages() {
  const { data: images } = useSWR(
    'https://jsonplaceholder.typicode.com/photos',
    fetcher
  );
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
        messages: [
          {
            id: uuid,
            userId: user?.sub,
            userName: user?.nickname,
            text: text,
            createdAt: formatISO(new Date()),
          },
        ],
      })
      .then((data) => {
        setPassword('');
        setRoomName('');
        setText('');
        console.log(data);
        return mutate('http://localhost:3001/chatRoom');
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [password, roomName, text, user?.sub]);

  const arrayImages: any[] = images;
  const arrayChatRoom: ChatRoom[] = chatRooms;
  const limitImages = arrayImages?.slice(0, 30);

  return (
    <Layout>
      <div className="group overflow-y-scroll hover:w-64 w-14 md:w-64 h-screen fixed duration-300 right-0 rounded-l-2xl bg-blue-300">
        {arrayChatRoom?.map((room) => {
          return <RightBar key={room.id} {...room} />;
        })}
      </div>
      <div className="p-8 h-full mr-14 md:mr-64">
        <div className="bg-blue-100 rounded-2xl">
          <div className="w-full p-4">
            <div className="mb-4">
              <input
                onChange={handleChangePassword}
                value={password}
                type="text"
                placeholder="合言葉を設定してください"
                className="w-full p-2 bg-blue-300 rounded-2xl focus:outline-none focus:ring-4 ring-blue-200 duration-200"
              />
            </div>

            <div className="mb-4">
              <input
                onChange={handleChangeRoomName}
                value={roomName}
                type="text"
                placeholder="ルーム名を設定してください"
                className="w-full p-2 bg-blue-300 rounded-2xl focus:outline-none focus:ring-4 ring-blue-200 duration-200"
              />
            </div>
            <div>
              <input
                onChange={handleChangeText}
                value={text}
                type="text"
                placeholder="最初の一言"
                className="w-full p-2 bg-blue-300 rounded-2xl focus:outline-none focus:ring-4 ring-blue-200 duration-200"
              />
            </div>
          </div>
        </div>

        <button onClick={handleClickAddPassword}>作成</button>
      </div>
    </Layout>
  );
});