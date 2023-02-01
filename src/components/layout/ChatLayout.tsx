import { AuthContext } from "@/context/AuthContext";
import React, { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BiLogOutCircle } from "react-icons/bi";
import { BsFillChatFill, BsPeopleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import BoxChat from "../Chat/BoxChat";
import { VscColorMode } from "react-icons/vsc";
import Tippy from "@tippyjs/react";
import { reactLocalStorage } from "reactjs-localstorage";
import { getLocal, setLocal } from "@/utils";
import BottomNav from "../BottomNav";
import { UserModel } from "@/model/User.model";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const dataSidebar = [
  {
    url: "/chat",
    icon: BsFillChatFill,
    title: "Chat",
  },
  {
    url: "/friend",
    icon: BsPeopleFill,
    title: "Friend",
  },
];

export const dataTheme = [
  "dracula",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const ChatLayout: FC<ChatLayoutProps> = ({ children }) => {
  const { user, socket, setUserOnline } = React.useContext(AuthContext);

  const router = useRouter();
  const { roomId } = router.query;

  const [theme, setTheme] = React.useState("dracula");

  const handleLogout = () => {
    deleteCookie("token");
    router.reload();
    socket.current.disconnect();
  };

  React.useEffect(() => {
    document
      ?.querySelector("html")
      ?.setAttribute("data-theme", getLocal("data-theme"));
    setTheme(getLocal("data-theme"));

 
  }, []);

  const handleChangeTheme = (newTheme: string) => {
    document?.querySelector("html")?.setAttribute("data-theme", newTheme);
    localStorage && setLocal("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <>
      <div className="flex px-2 ">
        <div className="w-[50px] hidden py-4 md:flex flex-col justify-between">
          <div className="flex-1 space-y-2">
            {dataSidebar?.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  onClick={() => router.push(item.url)}
                  key={index}
                  className={`avatar rounded-full w-[40px] h-[40px] hover:bg-primary cursor-pointer transition-all flex items-center justify-center p-1 ${
                    router.asPath.includes(item.url) && "bg-primary online"
                  }`}
                >
                  <Icon fontSize={24} />
                </div>
              );
            })}
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <div className="dropdown dropdown-top">
              <div
                tabIndex={0}
                className="rounded-full w-[40px] h-[40px] hover:bg-primary cursor-pointer transition-all flex items-center justify-center p-1"
              >
                <VscColorMode fontSize={28} />
              </div>
              <div
                tabIndex={0}
                className="dropdown-content menu-vertical bg-base-300 px-4 py-2 overflow-y-scroll  rounded-box max-h-[300px]"
              >
                {dataTheme.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleChangeTheme(item)}
                    className={`capitalize block py-1 rounded-md w-full cursor-pointer ${
                      theme === item && "bg-primary px-2"
                    } `}
                  >
                    <a>{item}</a>
                  </div>
                ))}
              </div>
            </div>
            <div className="avatar online">
              <div className="w-[40px] aspect-square">
                <LazyLoadImage src={user?.avatar} className="rounded-full" />
              </div>
            </div>
            <div
              onClick={handleLogout}
              className="rounded-full w-[40px] h-[40px] hover:bg-primary cursor-pointer transition-all flex items-center justify-center p-1"
            >
              <BiLogOutCircle fontSize={28} />
            </div>
          </div>
        </div>
        <div
          className={`w-full md:w-[23%]  py-2 px-2 ${
            roomId && "hidden md:block"
          }`}
        >
          {children}
        </div>
        <div className={`flex-1 md:block ${!roomId && "hidden"}`}>
          <BoxChat />
        </div>
      </div>
      {!roomId && <BottomNav />}
    </>
  );
};

export default ChatLayout;
