import { RoomMess } from "@/model/Message.model";
import { localeFunc } from "@/utils";
import React, { FC } from "react";
import { format } from "timeago.js";

interface CardMessageProps extends RoomMess {
  type?: string;
}

const CardMessage: FC<CardMessageProps> = ({ type = "start", createdAt,id,message,messageId,roomId,updatedAt,userId }) => {
  return (
    <div className={`chat ${type === "start" ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={message?.user?.avatar} />
        </div>
      </div>
      <div className="chat-header">
        {message?.user?.name}
        <time className="text-xs opacity-50 ml-1">{format(message?.createdAt,localeFunc as any)}</time>
      </div>
      {type === "start" ? (
        <div className="chat-bubble ">{message?.content}</div>
      ) : (
        <div className="chat-bubble chat-bubble-primary">{message?.content}</div>
      )}
      <div className="chat-footer opacity-50">Đã gửi</div>
    </div>
  );
};

export default CardMessage;
