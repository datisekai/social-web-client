import { UserModel } from "@/model/User.model";
import { server } from ".";

type LoginData = {
  phone: string;
  password: string;
};

type RegisterData = {
  name: string;
  phone: string;
  password: string;
};

type AuthProps = {
  token:string,
}

interface IAuthAction {
  login: (data: LoginData) => Promise<AuthProps>;
  register: (data: RegisterData) => Promise<AuthProps>;
}

const AuthAction: IAuthAction = {
  login: async (data) => {
    const result = await server.post("/user/login", data);
    return result.data;
  },
  register: async (data) => {
    const result = await server.post("/user/register", data);
    return result.data;
  },
};

export default AuthAction;
