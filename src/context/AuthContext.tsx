import { SOCKET_URL } from "@/actions";
import useAudio from "@/components/hooks/useAudio";
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

  React.useEffect(() => {
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
    } else if (Notification.permission === "granted") {
      console.log("Notification permission has been granted.");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission has been granted.");
        } else {
          console.error("Notification permission has been denied.");
        }
      });
    }



  }, []);

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
