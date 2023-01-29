import { RoomMessageModel } from "@/model/Message.model";
import { RoomModel } from "@/model/Room.model";
import { server } from ".";

interface NewRoom {
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  id: number;
  name: string;
  userId: number;
}

interface RoomUser {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  roomId: number;
  userId: number;
}

interface CreateRoomResult {
  newRoom: NewRoom;
  roomUsers: RoomUser[];
}

interface IRoomAction {
  createRoom2: (data: { receiveId: number }) => Promise<{data:RoomModel, isCreate:boolean}>;
  userRoom: () => Promise<RoomModel[]>;
  findRoom: (id: number | string) => Promise<RoomMessageModel>;
}

const RoomAction: IRoomAction = {
  createRoom2: async (data) => {
    const result = await server.post("/room", data);
    return result.data;
  },
  userRoom: async () => {
    const result = await server.get("/room/user");
    return result.data;
  },
  findRoom: async (id) => {
    const result = await server.get(`/room/find/${id}`);
    return result.data;
  },
};

export default RoomAction;
