export type ChatRoom = {
  id: string;
  createrId: string;
  password: string;
  roomName: string;
  createdAt: Date | string;
  users: User[];
};
export type User = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date | string;
};
export type Message = {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  text: string;
  createdAt: Date | string;
  chatRoomId: string;
};
