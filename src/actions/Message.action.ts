import { Message, RoomMess } from "@/model/Message.model";
import { server } from ".";

interface IMessageAction{
    addMessage:(data:any) => Promise<RoomMess> 
    recallMessage:(id: number | string) => Promise<string | number>
}

const MessageAction:IMessageAction = {
    addMessage:async(data) => {
        const result = await server.post('/message',data);
        return result.data
    },
    recallMessage:async(id) => {
        const result = await server.delete(`/message/recall/${id}`);
        return result.data
    }
}

export default MessageAction