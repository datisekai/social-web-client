import { Message, RoomMess } from "@/model/Message.model";
import { server } from ".";

interface IMessageAction{
    addMessage:(data:any) => Promise<RoomMess> 
}

const MessageAction:IMessageAction = {
    addMessage:async(data) => {
        const result = await server.post('/message',data);
        return result.data
    }
}

export default MessageAction