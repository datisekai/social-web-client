import { SOCKET_URL } from "@/actions";
import { UserModel } from "@/model/User.model";
import React, { createContext } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext<any>(undefined);

interface AuthProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthProps> = ({ children }) => {
  const [user, setUser] = React.useState<any>();
  const [userOnline, setUserOnline] = React.useState<UserModel[]>([]);
  const socket = React.useRef<any>(null);

  React.useEffect(() => {
    socket.current = io(SOCKET_URL);

    if (user) {
      socket.current.emit("add-user-active", user);
      socket.current.on("get-user-active", (users: UserModel[]) => {
        setUserOnline(users);
      });
    }
  }, [user]);


  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        socket,
        userOnline,
        setUserOnline,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
