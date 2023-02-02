import { uploadCloudinary } from "@/actions";
import MessageAction from "@/actions/Message.action";
import RoomAction from "@/actions/Room.action";
import { AuthContext } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react/headless";
import EmojiPicker from "emoji-picker-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiArrowBack, BiSend } from "react-icons/bi";
import {
  BsEmojiSmileFill,
  BsFillCameraVideoFill,
  BsThreeDots,
} from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useActiveElement from "../hooks/useActiveElement";
import useWindowSize from "../hooks/useWindowSize";
import CardMessage from "./CardMessage";
import Spinner from "../Loading/Spinner";

const BoxChat = () => {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState("");

  const router = useRouter();
  const activeElement = useActiveElement();
  const { roomId = 0 } = router.query;

  const { user, userOnline, socket } = React.useContext(AuthContext);

  const { data, isLoading } = useQuery(["box-chat", Number(roomId)], () => {
    if (roomId !== 0) {
      return RoomAction.findRoom(roomId.toString());
    }
    return null;
  });

  const [loadingImage, setLoadingImage] = useState(false);

  const [file, setFile] = useState<File>();

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
    let avatarReceive = "";

    if (user && data) {
      if (!currentName) {
        if (data?.room_users?.length === 2) {
          const receiveUser = data?.room_users.find(
            (item) => item.userId !== user.id
          );
          if (receiveUser) {
            currentName = receiveUser.user.name;
            activeId = receiveUser.userId;
            avatarReceive = receiveUser.user.avatar;
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
      avatarReceive,
    };
  }, [data, userOnline]);

  const { mutate: seenMessage } = useMutation(MessageAction.seenMessage, {
    onSuccess: (data, variables) => {
      socket.current?.emit("seen-message", {
        receiveId: dataRender.activeId,
        listMessage: data,
      });
    },
  });

  React.useEffect(() => {
    if (user && data && roomId != 0) {
      if (activeElement == inputRef.current) {
        const listMessage = data?.room_messes?.reduce((pre: number[], cur) => {
          if (cur.userId !== user?.id && !cur.message.isSeen) {
            return [...pre, cur.id];
          }
          return pre;
        }, []);

        if (listMessage && listMessage.length > 0) {
          seenMessage(Number(roomId));
        }
      }
    }
  }, [roomId, user, data, activeElement]);

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
      if (data && data.room_messes && roomMess.roomId == roomId) {
        queryClient.setQueryData(["box-chat", Number(roomId)], {
          ...data,
          room_messes: [...data?.room_messes, roomMess],
        });
      }

      let listChatOld: any = queryClient.getQueryData(["get-list-chat", user]);
      if (listChatOld) {
        const currentChat = listChatOld?.find(
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
      }
    });

    //SOCKET - Bắt sự kiện thu hồi tin nhắn realtime.
    socket?.current?.on(
      "get-recall-message",
      (result: { receiveId: number; messageId: number }) => {
        if (data && data.room_messes && user?.id === result.receiveId) {
          queryClient.setQueryData(["box-chat", Number(roomId)], {
            ...data,
            room_messes: data.room_messes.map((item: any) => {
              if (item.id == Number(result.messageId)) {
                return { ...item, message: { ...item.message, status: false } };
              }
              return item;
            }),
          });
        }
      }
    );

    //SOCKET - Bắt sự kiện lấy thông tin tin nhắn đã xem
    socket?.current?.on(
      "get-seen-message",
      (result: { receiveId: number; listMessage: number[] }) => {
        if (data) {
          const newRoomMess = data.room_messes.map((item) => {
            if (result.listMessage.includes(item.messageId)) {
              return { ...item, message: { ...item.message, isSeen: true } };
            }
            return item;
          });
          queryClient.setQueryData(["box-chat", Number(roomId)], {
            ...data,
            room_messes: newRoomMess,
          });
        }
      }
    );
  }, [socket.current, data]);

  React.useEffect(() => {
    //SOCKET - Bắt sự kiện thả cảm xúc realtime.
    socket?.current?.on(
      "get-react-message",
      (result: {
        messageId: number | string;
        userId: number;
        react: string;
        id: number | string;
        receiveId: number;
      }) => {
        const currentMessage = data?.room_messes?.find(
          (item: any) => item.messageId == result.messageId
        );
        const isReact = currentMessage?.message.mess_reacts.find(
          (item: any) => {
            return item.id === result.id;
          }
        );

        if (isReact) {
          let newMessageReact: any = [];
          if (isReact.react == result.react) {
            newMessageReact = currentMessage?.message.mess_reacts.filter(
              (item: any) => item.id !== result.id
            );
          } else {
            newMessageReact = currentMessage?.message.mess_reacts.map(
              (item: any) => {
                if (item.id === result.id) {
                  return { ...item, react: result.react };
                }
                return item;
              }
            );
          }
          queryClient.setQueryData(["box-chat", Number(roomId)], {
            ...data,
            room_messes: data?.room_messes.map((item: any) => {
              if (item.messageId === Number(result.messageId)) {
                return {
                  ...item,
                  message: { ...item.message, mess_reacts: newMessageReact },
                };
              }
              return item;
            }),
          });
        } else {
          queryClient.setQueryData(["box-chat", Number(roomId)], {
            ...data,
            room_messes: data?.room_messes.map((item: any) => {
              if (item.messageId == Number(result.messageId)) {
                return {
                  ...item,
                  message: {
                    ...item.message,
                    mess_reacts: [
                      ...item.message.mess_reacts,
                      {
                        messageId: Number(result.messageId),
                        userId: result.userId,
                        react: result.react,
                        id: result.id,
                      },
                    ],
                  },
                };
              }
              return item;
            }),
          });
        }
      }
    );
  }, [socket.current, data]);

  React.useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSend = () => {
    if (textMessage.trim().length > 0) {
      send({ content: textMessage, type: "text", roomId });
    }
  };

  React.useEffect(() => {
    if (file) {
      handleSendImage();
    }
  }, [file]);

  const handleSendImage = async () => {
    if (file) {
      setLoadingImage(true);
      const imageUrl = await uploadCloudinary(file);
      setLoadingImage(false);
      send({ content: imageUrl, type: "image", roomId });
    }
  };

  const scroll = React.useRef<any>(null);

  const header = React.useRef<any>(null);
  const toolChat = React.useRef<any>(null);

  const boxChatHeight = React.useMemo(() => {
    const heightHeader = header?.current?.offsetHeight || 72;
    const heightToolChat = toolChat?.current?.offsetHeight || 64;

    return height - (heightHeader + heightToolChat + 12);
  }, [header, toolChat, height]);

  return (
    <>
      {roomId ? (
        <div className="w-full h-full ">
          {loadingImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] z-[100]">
              <Spinner />
            </div>
          )}
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
                      <LazyLoadImage
                        className="rounded-full"
                        effect="blur"
                        src={dataRender.image}
                      />
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
            className=" px-2  mt-2 overflow-y-scroll"
            style={{ height: boxChatHeight }}
          >
            {data?.room_messes.map((item) =>
              item.userId === user?.id ? (
                <div key={item.id} ref={scroll}>
                  <CardMessage
                    receiveId={dataRender.activeId}
                    avatarReceive={dataRender.avatarReceive}
                    {...item}
                    type="end"
                  />
                </div>
              ) : (
                <div key={item.id} ref={scroll}>
                  <CardMessage
                    receiveId={dataRender.activeId}
                    avatarReceive={dataRender.avatarReceive}
                    {...item}
                    type="start"
                  />
                </div>
              )
            )}
          </div>
          <div
            ref={toolChat}
            className=" shadow-md py-2 bottom-0 justify-between flex items-center space-x-2"
          >
            <label htmlFor="messageImage">
              <div className=" p-1 md:p-2 hover:bg-primary-content cursor-pointer rounded-full">
                <AiOutlinePlus className="text-primary text-[24px] md:text-[28px]" />
              </div>
            </label>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target && e.target.files && setFile(e.target.files[0])
              }
              accept="image/*"
              id="messageImage"
            />
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
              <div
                onClick={handleSend}
                className="p-1 md:p-2 hover:bg-primary-content cursor-pointer rounded-full"
              >
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
