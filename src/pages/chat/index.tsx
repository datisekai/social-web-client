import CardChat from "@/components/Chat/CardChat";
import AuthLayout from "@/components/layout/AuthLayout";
import ChatLayout from "@/components/layout/ChatLayout";
import ListChat from "@/components/ListChat";
import Meta from "@/components/Meta";
import { GetServerSideProps } from "next";
import React from "react";

const Chat = () => {
  return (
    <>
      <Meta
        description="Chia sẻ thông tin với bạn bè, nhắn tin với người bạn yêu quý"
        image="/logo.png"
        title="Nhắn tin | FIRECHAT"
      />
      <AuthLayout>
        <ChatLayout>
          <ListChat />
        </ChatLayout>
      </AuthLayout>
    </>
  );
};

export default Chat;
