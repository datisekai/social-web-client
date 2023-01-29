import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Meta from "@/components/Meta";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import ChatLayout from "@/components/layout/ChatLayout";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["vietnamese"] });

export default function Home() {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  return (
    <>
      <Meta
        description="Chia sẻ thông tin với bạn bè, nhắn tin với người bạn yêu quý"
        image="/logo.png"
        title="Nhắn tin | FIRECHAT"
      />
      <AuthLayout>
        <ChatLayout>Center</ChatLayout>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {},
    redirect: {
      destination: "/chat",
    },
  };
};
