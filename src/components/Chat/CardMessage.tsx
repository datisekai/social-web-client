import MessageAction from "@/actions/Message.action";
import { AuthContext } from "@/context/AuthContext";
import { RoomMess } from "@/model/Message.model";
import { localeFunc, successNotify } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FC } from "react";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { format } from "timeago.js";

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
      <div className="chat-header">
        {message?.user?.name}
        <time className="text-xs opacity-50 ml-1">
          {format(message?.createdAt, localeFunc as any)}
        </time>
      </div>

      <div className={`flex items-center `}>
        {message.userId === user?.id && message.status && !isLoading && (
          <div className="dropdown dropdown-top">
            <span tabIndex={0} className="">
              <BiDotsVerticalRounded className="text-[24px] md:text-[28px] text-primary p-1 hover:bg-primary-content rounded-full" />
            </span>
            <ul
              tabIndex={0}
              className="dropdown-content text-sm shadow-xl  bg-base-300 menu p-2  rounded-box w-32"
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
          className={`chat-bubble ${type === "end" && "chat-bubble-primary"}`}
        >
          {message.status ? message?.content : "Tin nhắn đã thu hồi"}
        </div>
      </div>
      <div className="chat-footer text-xs opacity-50">Đã gửi</div>
    </div>
  );
};

export default CardMessage;
