import { UserModel } from "./User.model";

interface RoomUser {
  id: number;
  roomId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
}

interface Message {
  id: number;
  content: string;
  status: boolean;
  userId: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  user?:UserModel
}

interface RoomMess {
  id: number;
  roomId: number;
  userId: number;
  messageId: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
  message: Message;
}

export interface RoomModel {
  id: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  room_users: RoomUser[];
  room_messes: RoomMess[];
  messageId: number | null,
  message?:Message
}
