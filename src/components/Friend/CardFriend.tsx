import { UserModel } from "@/model/User.model";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface CardFriendProps extends UserModel{
  isActive?:boolean
}

const CardFriend:React.FC<CardFriendProps> = ({avatar,createdAt,gender,id,name,phone,status,updatedAt,socketId,isActive = true}) => {
  return (
    <div className="flex py-1 px-1 hover:bg-primary cursor-pointer rounded-md items-center space-x-2">
      <div className={`avatar ${isActive && 'online'}`}>
        <div className="w-14 rounded-full">
          <LazyLoadImage effect="blur" className="rounded-full" src={avatar} />
        </div>
      </div>
      <div className="">
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default CardFriend;
