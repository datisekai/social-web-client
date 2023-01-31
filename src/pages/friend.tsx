import { SOCKET_URL } from "@/actions";
import RoomAction from "@/actions/Room.action";
import UserAction from "@/actions/User.action";
import CardFriend from "@/components/Friend/CardFriend";
import useWindowSize from "@/components/hooks/useWindowSize";
import AuthLayout from "@/components/layout/AuthLayout";
import ChatLayout from "@/components/layout/ChatLayout";
import Spinner from "@/components/Loading/Spinner";
import { AuthContext } from "@/context/AuthContext";
import { UserModel } from "@/model/User.model";
import { errorNotify } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const Friend = () => {
  const { user, userOnline } = useContext(AuthContext);

  const { socket } = useContext(AuthContext);

  const router = useRouter();

  const { data: listUser, isLoading } = useQuery(
    ["user-not-me", user],
    UserAction.getAllNotMe
  );

  const { mutate: createRoom, isLoading: isCreateRoom } = useMutation(
    RoomAction.createRoom2,
    {
      onSuccess: (data, variables) => {
        //Gửi room mới tạo về server
        if (data.isCreate) {
          socket.current.emit("create-room-2", {
            data: data.data,
            receiveId: variables.receiveId,
          });
        }

        router.push(`/chat/${data.data.id}`);
      },
      onError: (err: any) => {
        console.log(err);
        errorNotify(err);
      },
    }
  );

  const activeRenders: UserModel[] = React.useMemo(() => {
    return userOnline.filter((item: any) => item.id !== user?.id);
  }, [userOnline]);

  const handleCreateRoom2 = (friend: UserModel) => {
    createRoom({ receiveId: friend.id });
  };

  const userOffline = React.useMemo(() => {
    return listUser?.reduce((pre: any, cur: any) => {
      if (!userOnline.some((item: any) => item.id === cur.id)) {
        return [...pre, cur];
      }
      return [...pre];
    }, []);
  }, [listUser, userOnline]);

  const { height } = useWindowSize();

  return (
    <AuthLayout>
      <ChatLayout>
        <>
          <section className="py-2">
            <div>
              <h1 className="text-lg md:text-xl">Mọi người</h1>
              <section className="mt-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="input input-bordered input-primary w-full max-w-full md:max-w-sm"
                />
              </section>
            </div>
            <div
              className="mt-2  overflow-y-scroll pb-16"
              style={{ height: height - 130 }}
            >
              <section className="">
                <p className="text-sm text-info mt-4">
                  Người liên hệ đang hoạt động{" "}
                  <span>{`(${activeRenders.length})`}</span>
                </p>
                <section className="mt-4 space-y-2 ">
                  {activeRenders?.map((item) => (
                    <div onClick={() => handleCreateRoom2(item)} key={item.id}>
                      <CardFriend {...item} />
                    </div>
                  ))}
                </section>
              </section>
              <section>
                <p className="text-sm text-info mt-4 ">
                  Người liên hệ offline{" "}
                  <span>{`(${userOffline?.length || 0})`}</span>
                </p>
                <section className="mt-4 space-y-2 ">
                  {userOffline?.map((item) => (
                    <div onClick={() => handleCreateRoom2(item)} key={item.id}>
                      <CardFriend {...item} isActive={false} />
                      </div>
                  ))}
                </section>
              </section>
            </div>
          </section>

          {isCreateRoom && (
            <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[rgba(0,0,0,0.6)]">
              <Spinner />
            </div>
          )}
        </>
      </ChatLayout>
    </AuthLayout>
  );
};

export default Friend;
