export type ChatRoom = {
  id: string;
  createrId: string;
  password: string;
  roomName: string;
  createdAt: Date | string;
  messages: Message[];
};

export type Message = {
  id: string;
  userId: string;
  text: string;
  createdAt: Date | string;
};
