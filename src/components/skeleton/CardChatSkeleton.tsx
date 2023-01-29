import React from "react";

const CardChatSkeleton = () => {
  return (
    <div className="flex animate-pulse py-1 px-1 hover:bg-primary cursor-pointer rounded-md items-center space-x-2">
      <div className="avatar online">
        <div className="w-14 rounded-full bg-gray-300"></div>
      </div>
      <div className="space-y-1 w-full">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[70%] mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      </div>
    </div>
  );
};

export default CardChatSkeleton;
