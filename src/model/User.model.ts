export interface UserModel {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  gender: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  socketId?:string
}
