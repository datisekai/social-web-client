import MessageAction from "@/actions/Message.action";
import { AuthContext } from "@/context/AuthContext";
import { RoomMess } from "@/model/Message.model";
import { localeFunc, reactionGif, reactionImage, successNotify } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FC } from "react";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { format } from "timeago.js";
import Lodash from "lodash";

interface CardMessageProps extends RoomMess {
  type?: string;
  receiveId: number;
}

const CardMessage: FC<CardMessageProps> = ({
  type = "start",
  createdAt,
  id,
  message,
  messageId,
  roomId,
  updatedAt,
  userId,
  receiveId,
}) => {
  const { user, socket } = React.useContext(AuthContext);

  const queryClient = useQueryClient();

  const { mutate: recall, isLoading } = useMutation(
    MessageAction.recallMessage,
    {
      onSuccess: (data, variables) => {
        const boxChatOld: any = queryClient.getQueryData([
          "box-chat",
          Number(roomId),
        ]);
        queryClient.setQueryData(["box-chat", Number(roomId)], {
          ...boxChatOld,
          room_messes: boxChatOld.room_messes.map((item: any) => {
            if (item.id == Number(variables)) {
              return { ...item, message: { ...item.message, status: false } };
            }
            return item;
          }),
        });
        socket.current.emit("recall-message", { receiveId, messageId });

        const listChatOld: any = queryClient.getQueryData([
          "get-list-chat",
          user,
        ]);
        queryClient.setQueryData(
          ["get-list-chat", user],
          listChatOld?.map((item: any) => {
            if (item.messageId === Number(variables)) {
              return { ...item, message: { ...item.message, status: false } };
            }
            return item;
          })
        );
        successNotify("Đã thu hồi tin nhắn");
      },
      onError: () => {},
    }
  );

  const handleRecall = () => {
    recall(messageId);
  };

  const { mutate: dropReact } = useMutation(MessageAction.reactMessage, {
    onSuccess: (data, variables) => {
      const isReact = message.mess_reacts.find((item) => item.id === data.id);
      const boxChatOld: any = queryClient.getQueryData([
        "box-chat",
        Number(roomId),
      ]);
      if (isReact) {
        let newMessageReact:any = []
        if(isReact.react == data.react){
            newMessageReact = message.mess_reacts.filter(item => item.id !== data.id);
        }else{
          newMessageReact = message.mess_reacts.map((item) => {
            if (item.id === data.id) {
              return { ...item, react: data.react };
            }
            return item;
          });
        }
        

        queryClient.setQueryData(["box-chat", Number(roomId)], {
          ...boxChatOld,
          room_messes: boxChatOld.room_messes.map((item: any) => {
            if (item.messageId === Number(data.messageId)) {
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
          ...boxChatOld,
          room_messes: boxChatOld.room_messes.map((item: any) => {
            if (item.messageId === Number(data.messageId)) {
              return {
                ...item,
                message: {
                  ...item.message,
                  mess_reacts: [
                    ...item.message.mess_reacts,
                    {
                      messageId: Number(data.messageId),
                      userId: data.userId,
                      react: data.react,
                      id: data.id,
                    },
                  ],
                },
              };
            }
            return item;
          }),
        });
      }

      socket?.current.emit("react-message", { ...data, receiveId });
    },
    onError: () => {},
  });



  const handleReaction = (react: string) => {
    dropReact({ messageId, react });
    document?.activeElement && (document?.activeElement as any)?.blur();
  };

  const reactDifference = React.useMemo(() => {
    //Tìm list reacts không trùng lặp và đếm số lượng để sort
    const reacts = message.mess_reacts.reduce(
      (pre: { count: number; react: string }[], cur) => {
        if (!pre.some((item) => item.react === cur.react)) {
          return [...pre, { count: 1, react: cur.react }];
        } else {
          return pre.map((item) => {
            if (item.react === cur.react) {
              return { ...item, count: item.count + 1 };
            }
            return item;
          });
        }
      },
      []
    );


    return {
      isMany: reacts.length > 0,
      reacts: reacts.sort((a, b) => b.count - a.count),
    };
  }, [message]);

  return (
    <div className={`chat ${type === "start" ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <LazyLoadImage
            className="rounded-full"
            effect="blur"
            src={message?.user?.avatar}
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        {message?.user?.name}
        <time className="text-xs opacity-50 ml-1">
          {format(message?.createdAt, localeFunc as any)}
        </time>
      </div>

      <div
        className={`flex items-center ${
          user.id === userId ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {message?.status && (
          <div className="dropdown  dropdown-top ">
            <label tabIndex={0} className="">
              <div className="p-1 hover:bg-primary-content rounded-full cursor-pointer">
                <BsFillEmojiSmileFill className=" text-primary" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className={`dropdown-content  flex p-1 space-x-1  shadow bg-base-300  rounded-box  ${
                message?.userId === user?.id
                  ? "right-[50%] translate-x-[50%]"
                  : "left-0 translate-x-[-50%]"
              }`}
            >
              {reactionGif.map((item) => {
                const isUser = message.mess_reacts.some(element => element.react == item.id && element.userId === user?.id);
                return  <li
                onClick={() => handleReaction(item.id)}
                key={item.id}
                className={`cursor-pointer ${isUser && 'translate-y-[-2px] bg-primary'}`}
              >
                <a>
                  <div className="w-[25px] h-[25px]">
                    <LazyLoadImage
                      effect="blur"
                      src={item.image}
                      alt={item.id}
                    />
                  </div>
                </a>
              </li>
              })}
            </ul>
          </div>
        )}
        {message?.userId === user?.id && message?.status && !isLoading && (
          <div className="dropdown dropdown-top">
            <span tabIndex={0} className="">
              <BiDotsVerticalRounded className="text-[24px] md:text-[28px] text-primary p-1 hover:bg-primary-content rounded-full" />
            </span>
            <ul
              tabIndex={0}
              className="dropdown-content  text-sm shadow-xl  bg-base-300 menu p-2  rounded-box w-32"
            >
              <li
                onClick={() => {
                  handleRecall();
                  document?.activeElement &&
                    (document?.activeElement as any)?.blur();
                }}
              >
                <a>Thu hồi</a>
              </li>
              <li
                onClick={() => {
                  navigator?.clipboard?.writeText(message.content);
                  document?.activeElement &&
                    (document?.activeElement as any)?.blur();
                  successNotify("Đã sao chép");
                }}
              >
                <a>Sao chép</a>
              </li>
            </ul>
          </div>
        )}

        <div
          className={`chat-bubble max-w-full md:max-w-sm ${
            type === "end" && "chat-bubble-primary"
          }`}
        >
          {message?.status ? message?.content : "Tin nhắn đã thu hồi"}
          {message?.status && (
            <div
              className={`absolute bg-base-300  flex space-x-[2px] px-1 py-[2px] items-center rounded-full ${
                user?.id === message?.userId
                  ? "left-0 translate-x-[-50%]"
                  : "right-0 translate-x-[50%]"
              }`}
            >
              {reactDifference.reacts.map((item) => (
                <div
                  key={item.react}
                  className="w-[16px] h-[16px] flex items-center justify-center"
                >
                  <LazyLoadImage
                    className="w-full"
                    src={reactionImage[item.react]}
                  />
                </div>
              ))}
              {reactDifference.isMany && (
                <span className="text-xs">{message.mess_reacts.length}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="chat-footer text-xs opacity-50 mt-1">Đã gửi</div>
    </div>
  );
};

export default CardMessage;
