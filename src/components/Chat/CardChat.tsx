import { AuthContext } from "@/context/AuthContext";
import { RoomModel } from "@/model/Room.model";
import { useRouter } from "next/router";
import React from "react";

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

  return (
    <div
      className={`flex py-2 px-1 hover:bg-base-300 cursor-pointer rounded-md items-center space-x-2 ${
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
            <img src={dataRender.image} />
          </div>
        </div>
      ) : (
        <div className="avatar rounded-full placeholder">
          <div className="w-14 bg-neutral-focus text-neutral-content">
            <span>+{room_users.length - 1}</span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <h3>{dataRender.name}</h3>
        <p className="text-sm line-clamp-1">
          {messageId != null
            ? `${message?.user?.name}: ${message?.content}`
            : "Kết nối bạn bè qua FIRECHAT"}
        </p>
      </div>
    </div>
  );
};

export default CardChat;