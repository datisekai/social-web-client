import React from "react";
import { MdCall } from "react-icons/md";
import {
  BsFillCameraVideoFill,
  BsImage,
  BsThreeDots,
  BsEmojiSmileFill,
} from "react-icons/bs";
import CardMessage from "./CardMessage";
import { AiFillFile } from "react-icons/ai";
import EmojiPicker from "emoji-picker-react";
import Tippy from "@tippyjs/react/headless";
import { reactLocalStorage } from "reactjs-localstorage";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RoomAction from "@/actions/Room.action";
import { AuthContext } from "@/context/AuthContext";
import { BiArrowBack, BiSend } from "react-icons/bi";
import MessageAction from "@/actions/Message.action";
import useWindowSize from "../hooks/useWindowSize";

const BoxChat = () => {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState("");

  const router = useRouter();
  const { roomId = 0 } = router.query;

  const { user, userOnline, socket } = React.useContext(AuthContext);

  const { data, isLoading } = useQuery(["box-chat", Number(roomId)], () => {
    if (roomId !== 0) {
      return RoomAction.findRoom(roomId.toString());
    }
    return null;
  });

  const { height } = useWindowSize();

  const inputRef = React.useRef<any>(null);

  const handleEmojiClick = (emojiData: any, event: any) => {
    setTextMessage(textMessage + emojiData.emoji);
    inputRef?.current?.focus();
  };

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, [roomId]);

  const dataRender = React.useMemo(() => {
    let currentName = data?.name;
    let currentImage = data?.image;
    let activeId = 0;

    if (user && data) {
      if (!currentName) {
        if (data?.room_users.length === 2) {
          const receiveUser = data?.room_users.find(
            (item) => item.userId !== user.id
          );
          if (receiveUser) {
            currentName = receiveUser.user.name;
            activeId = receiveUser.userId;
          }
        } else {
          currentName = "Chưa có tên";
        }
      }

      if (!currentImage) {
        if (data?.room_users.length === 2) {
          const receiveUser = data?.room_users.find(
            (item) => item.userId !== user.id
          );
          if (receiveUser) {
            currentImage = receiveUser.user.avatar;
          }
        } else {
          currentImage = "";
        }
      }
    }

    return {
      name: currentName,
      image: currentImage,
      activeId,
    };
  }, [data, userOnline]);

  const queryClient = useQueryClient();

  const { mutate: send, isLoading: isSending } = useMutation(
    MessageAction.addMessage,
    {
      onSuccess: (message) => {
        queryClient.setQueryData(["box-chat", Number(roomId)], {
          ...data,
          room_messes: [...(data?.room_messes as any), message],
        });
        socket.current.emit("send-message-cr2", {
          roomMessage: message,
          receiveId: dataRender.activeId,
        });

        let listChatOld: any = queryClient.getQueryData([
          "get-list-chat",
          user,
        ]);

        const currentChat = listChatOld.find(
          (item: any) => item.id === message.roomId
        );
        if (currentChat) {
          const newListChat = [
            {
              ...currentChat,
              messageId: message.messageId,
              message: message.message,
            },
            ...listChatOld.filter((item: any) => item.id !== message.roomId),
          ];
          queryClient.setQueryData(["get-list-chat", user], newListChat);
        }

        setTextMessage("");
      },
    }
  );

  React.useEffect(() => {
    socket.current?.on("get-new-message-cr2", (roomMess: any) => {
      if (data && data.room_messes) {
        queryClient.setQueryData(["box-chat", Number(roomId)], {
          ...data,
          room_messes: [...data?.room_messes, roomMess],
        });
      }

      let listChatOld: any = queryClient.getQueryData(["get-list-chat", user]);
      const currentChat = listChatOld.find(
        (item: any) => item.id === roomMess.roomId
      );
      if (currentChat) {
        const newListChat = [
          {
            ...currentChat,
            messageId: roomMess.messageId,
            message: roomMess.message,
          },
          ...listChatOld.filter((item: any) => item.id !== roomMess.roomId),
        ];
        queryClient.setQueryData(["get-list-chat", user], newListChat);
      }
    });
  }, [data]);

  React.useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSend = () => {
    if (textMessage.trim().length > 0) {
      send({ content: textMessage, type: "text", roomId });
    }
  };

  const scroll = React.useRef<any>(null);

  const header = React.useRef<any>(null);
  const toolChat = React.useRef<any>(null);

  const boxChatHeight = React.useMemo(() => {
    const heightHeader = header?.current?.offsetHeight || 0;
    const heightToolChat = toolChat?.current?.offsetHeight || 0;

    console.log(height, heightHeader, heightToolChat)

    return height - (heightHeader + heightToolChat + 12);
  }, [header, toolChat, height]);

  return (
    <>
      {roomId ? (
        <div className="w-full h-full">
          <header
            ref={header}
            className="sticky top-0 py-2 bg-base-100 z-[50] shadow-lg flex items-center justify-between"
          >
            {!isLoading && (
              <div className="flex items-center space-x-2 max-w-sm">
                {roomId && (
                  <div
                    className="block md:hidden"
                    onClick={() => router.back()}
                  >
                    <BiArrowBack className="text-[28px] text-primary" />
                  </div>
                )}
                {dataRender.image ? (
                  <div
                    className={`avatar ${
                      userOnline.some(
                        (item: any) => item.id === dataRender.activeId
                      ) && "online"
                    }`}
                  >
                    <div className="w-12 md:w-14 rounded-full">
                      <img src={dataRender.image} />
                    </div>
                  </div>
                ) : (
                  <div className="avatar rounded-full placeholder">
                    <div className="w-14 bg-neutral-focus text-neutral-content">
                      <span>+{data?.room_users.length || 1 - 1}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <h3>{dataRender?.name}</h3>
                  {userOnline.some(
                    (item: any) => item.id === dataRender.activeId
                  ) && (
                    <span className="text-xs md:text-sm font-thin text-info">
                      Đang hoạt động
                    </span>
                  )}
                </div>
              </div>
            )}
            {isLoading && (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="flex items-center justify-center w-12 aspect-square md:w-14 rounded-full bg-gray-300  dark:bg-gray-700"></div>
                <div className="space-y-1">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-28 sm:w-32 md:w-36"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24 sm:w-28 md:w-32"></div>
                </div>
              </div>
            )}
            <div className="max-w-sm flex items-center space-x-4">
              <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
                <MdCall className="text-primary text-[24px] md:text-[28px]" />
              </div>
              <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
                <BsFillCameraVideoFill className="text-primary text-[24px] md:text-[28px]" />
              </div>
              <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
                <BsThreeDots className="text-primary text-[24px] md:text-[28px]" />
              </div>
            </div>
          </header>
          <div
            className=" px-2 overflow-y-scroll mt-2"
            style={{ height: boxChatHeight }}
          >
            {data?.room_messes.map((item) =>
              item.userId === user?.id ? (
                <div key={item.id} ref={scroll}>
                  <CardMessage {...item} type="end" />
                </div>
              ) : (
                <div key={item.id} ref={scroll}>
                  <CardMessage {...item} type="start" />
                </div>
              )
            )}
          </div>
          <div
            ref={toolChat}
            className=" shadow-md py-2 bottom-0 justify-between flex items-center space-x-2"
          >
            <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
              <BsImage className="text-primary text-[24px] md:text-[28px]" />
            </div>
            <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
              <AiFillFile className="text-primary text-[24px] md:text-[28px]" />
            </div>
            <input
              type="text"
              value={textMessage}
              ref={inputRef}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Viết tin nhắn"
              className="input input-bordered  input-primary w-full"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <div className="p-2 hover:bg-primary-content cursor-pointer rounded-full">
              <Tippy
                interactive={true}
                content="Emoji"
                visible={showEmoji}
                onClickOutside={() => setShowEmoji(false)}
                render={(attrs) => (
                  <div {...attrs} className="mb-2">
                    <EmojiPicker
                      emojiVersion={"1.0"}
                      onEmojiClick={handleEmojiClick}
                    />
                  </div>
                )}
              >
                <div className="relative">
                  <BsEmojiSmileFill
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="text-primary text-[24px] md:text-[28px]"
                  />
                </div>
              </Tippy>
            </div>
            {isSending ? (
              <div className="btn text-primary cursor-pointer"></div>
            ) : (
              <div className="btn text-primary cursor-pointer">
                <BiSend className="text-primary text-[24px] md:text-[28px]" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          Chọn để chat với bạn bè của bạn
        </div>
      )}
    </>
  );
};

export default BoxChat;
