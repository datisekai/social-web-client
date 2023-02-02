import { AuthContext } from "@/context/AuthContext";
import { RoomModel } from "@/model/Room.model";
import { useRouter } from "next/router";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CardChat: React.FC<RoomModel> = ({
  createdAt,
  id,
  room_users,
  status,
  updatedAt,
  room_messes,
  message,
  messageId,
}) => {
  const { user, userOnline } = React.useContext(AuthContext);

  const router = useRouter();

  const { roomId = 0 } = router.query;

  const dataRender = React.useMemo(() => {
    let currentName = "";
    let currentImage = "";
    let receiveId = 0;

    const receiveUser = room_users.find((item) => item.userId !== user?.id);
    if (receiveUser) {
      currentName = receiveUser.user.name;
      currentImage = receiveUser.user.avatar;
      receiveId = receiveUser.userId;
    }

    return {
      name: currentName,
      image: currentImage,
      receiveId,
    };
  }, [room_users, userOnline]);



  const messageRender = React.useMemo(() => {
    let currentMessage = 'Kết nối bạn bè qua FIRECHAT'

    if(messageId != null){
      if(message?.status){
        if(message.type === 'text'){
          currentMessage = `${message.userId === user?.id ? 'Bạn' : message.user?.name}: ${message.content}`
        }else if(message.type === 'image'){
          currentMessage = `${message.userId === user?.id ? 'Bạn' : message.user?.name}: Đã gửi 1 ảnh`
        }
      }else{
        currentMessage = `${message?.userId === user?.id ? 'Bạn' : message?.user?.name}: Tin nhắn đã thu hồi`
      }
    }

    return currentMessage;
  },[message])

  return (
    <div
      className={`flex py-2 px-1 relative ${!message?.isSeen && dataRender.receiveId === message?.userId && 'not-seen'} hover:bg-base-300 cursor-pointer rounded-md items-center space-x-2 ${
        Number(roomId) === id && "bg-base-300"
      }`}
    >
      {dataRender.image ? (
        <div
          className={`avatar ${
            userOnline.some((item: any) => item.id === dataRender.receiveId) &&
            "online"
          }`}
        >
          <div className="w-14 rounded-full">
            <LazyLoadImage
              effect="blur"
              className="rounded-full"
              src={dataRender.image}
            />
          </div>
        </div>
      ) : (
        <div className="avatar rounded-full placeholder">
          <div className="w-14 bg-neutral-focus text-neutral-content">
            <span>+{room_users.length - 1}</span>
          </div>
        </div>
      )}

      <div className={`space-y-1  ${!message?.isSeen && dataRender.receiveId === message?.userId && 'text-primary'}`}>
        <h3>{dataRender.name}</h3>
        <p className="text-sm line-clamp-1">
          {messageRender}
        </p>
      </div>
    </div>
  );
};

export default CardChat;
