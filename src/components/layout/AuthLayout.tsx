import UserAction from "@/actions/User.action";
import { AuthContext } from "@/context/AuthContext";
import { UserModel } from "@/model/User.model";
import { useQuery } from "@tanstack/react-query";
import React, { FC, useContext, useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const { data, isLoading } = useQuery(["my-info"], UserAction.myInfo);

  const { user, setUser, socket, setUserOnline } = useContext(AuthContext);

  useEffect(() => {
    if (data) {
      setUser(data);
    } else {
      setUser(undefined);
    }
  }, [data]);

  return <main>{children}</main>;
};

export default AuthLayout;
