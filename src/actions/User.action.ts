import { UserModel } from "@/model/User.model"
import { server } from "."

interface IUserAction{
    myInfo:() => Promise<UserModel>
    getAllNotMe:() => Promise<UserModel[]>
}

const UserAction:IUserAction = {
    myInfo:async() => {
        const result = await server.get('/user/me');
        return result.data;
    },
    getAllNotMe:async()=>{
        const result = await server.get('/user/user-not-me');
        return result.data;
    }
  
}


export default UserAction