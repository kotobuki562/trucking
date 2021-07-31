export type ChatRoom = {
  id: string;
  createrId: string;
  password: string;
  name: string;
  createdAt: Date | string;
};
export type User = {
  userId: string;
  createdAt: Date | string;
};

export type SubMessage = {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  text: string;
  createdAt: Date | string;
};

export type Message = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  text: string;
  createdAt: Date | string;
  chatRoomId: string;
  messages: SubMessage[];
};
