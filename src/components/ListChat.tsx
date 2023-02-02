import RoomAction from "@/actions/Room.action";
import { AuthContext } from "@/context/AuthContext";
import { RoomModel } from "@/model/Room.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CardChat from "./Chat/CardChat";
import useAudio from "./hooks/useAudio";
import useDebounce from "./hooks/useDebounce";
import Sidebar from "./Sidebar";
import CardChatSkeleton from "./skeleton/CardChatSkeleton";

const ListChat = () => {
  const { user, socket } = React.useContext(AuthContext);
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [chatSearch, setChatSearch] = useState<RoomModel[]>([]);

  const debounceSearch = useDebounce(search, 500);

  const [isOpenSidebar, setIsOpenSidebar] = React.useState(false);

  const { data, isLoading } = useQuery(
    ["get-list-chat", user],
    RoomAction.userRoom
  );

  React.useEffect(() => {
    socket.current?.on("get-new-room-cr2", (newRoom: any) => {
      if (data) {
        queryClient.setQueryData(["get-list-chat", user], [newRoom, ...data]);
      }
    });

    socket.current?.on("get-recall-message", (result: any) => {
      if (data?.some((item: any) => item.messageId === result.messageId)) {
        queryClient.setQueryData(
          ["get-list-chat", user],
          data?.map((item: any) => {
            if (item.messageId === result.messageId) {
              return { ...item, message: { ...item.message, status: false } };
            }
            return item;
          })
        );
      }
    });
  }, [data]);

  useEffect(() => {
    if (debounceSearch.trim().length > 0) {
      const resultSearch =
        data?.filter(
          (item) =>
            item.messageId != null &&
            (item.message?.content
              .toLowerCase()
              .indexOf(debounceSearch.toLowerCase()) !== -1 ||
              item.room_users.some(
                (element) =>
                  element.user.name
                    .toLowerCase()
                    .indexOf(debounceSearch.toLowerCase()) !== -1
              ))
        ) || [];

      setChatSearch(resultSearch);
    } else {
      setChatSearch([]);
    }
  }, [debounceSearch]);

  console.log(data)

  return (
    <div className="h-full">
      <div className=" bg-base-100  py-2 md:py-0">
        <section className=" flex items-center flex-row-reverse md:flex-row justify-between">
          <h1 className="text-lg md:text-xl">Chat</h1>
          <label className="md:hidden btn btn-circle swap swap-rotate">
            <input
              type="checkbox"
              checked={isOpenSidebar}
              onChange={(e) => {
                setIsOpenSidebar(!isOpenSidebar);
              }}
            />

            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </section>
        <section className="mt-2">
          <input
            type="text"
            placeholder="Tìm kiếm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="input input-bordered input-primary w-full max-w-full md:max-w-sm"
          />
        </section>
      </div>
      {debounceSearch.trim().length > 0 ? (
        <section className=" mt-4 space-y-1 h-[85%] overflow-y-scroll">
          {chatSearch.map((item) => (
            <div key={item.id}>
              <Link href={`/chat/${item.id}`}>
                <CardChat {...item} />
              </Link>
            </div>
          ))}
        </section>
      ) : (
        <section className=" mt-4 space-y-1 h-[85%] overflow-y-scroll">
          {isLoading
            ? [1, 2, 3, 4, 5].map((item) => <CardChatSkeleton key={item} />)
            : data?.map((item) => (
                <div key={item.id}>
                  <Link href={`/chat/${item.id}`}>
                    <CardChat {...item} />
                  </Link>
                </div>
              ))}
          {data && data.length === 0 && (
            <p className="text-center">Chọn bạn bè ở tab friend để nhắn tin</p>
          )}
        </section>
      )}
      <Sidebar
        open={isOpenSidebar}
        handleClose={() => setIsOpenSidebar(false)}
      />
    </div>
  );
};

export default ListChat;
