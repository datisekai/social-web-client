import { UserModel } from "./User.model";

interface RoomUser {
  id: number;
  roomId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
}

interface MessageReact{
    id?:number,
    createdAt?:Date,
    updatedAt?:Date,
    react:string,
    messageId:number,
    userId:number
}

export interface Message {
  id: number;
  content: string;
  status: boolean;
  userId: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
  mess_reacts: MessageReact[];
}

export interface RoomMess {
  id: number;
  roomId: number;
  userId: number;
  messageId: number;
  createdAt: Date;
  updatedAt: Date;
  message: Message;
  user?:UserModel
}

export interface RoomMessageModel {
  id: number;
  name?: any;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  image?: any;
  room_users: RoomUser[];
  room_messes: RoomMess[];
}
