import { Message, RoomMess } from "@/model/Message.model";
import { server } from ".";

interface IMessageAction {
  addMessage: (data: any) => Promise<RoomMess>;
  recallMessage: (id: number | string) => Promise<string | number>;
  reactMessage: (data: {
    messageId: number;
    react: string;
  }) => Promise<{
    messageId: number | string;
    userId: number;
    react: string;
    id: number | string;
  }>;
  seenMessage:(roomId:number) => Promise<number[]>
}

const MessageAction: IMessageAction = {
  addMessage: async (data) => {
    const result = await server.post("/message", data);
    return result.data;
  },
  recallMessage: async (id) => {
    const result = await server.delete(`/message/recall/${id}`);
    return result.data;
  },
  reactMessage: async (data) => {
    const result = await server.post(`/message/react/${data.messageId}`, {
      react: data.react,
    });
    return result.data;
  },
  seenMessage:async(roomId) => {
    const result = await server.get(`/message/seen/${roomId}`)
    return result.data
  }
};

export default MessageAction;
