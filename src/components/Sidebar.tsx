import { AuthContext } from "@/context/AuthContext";
import { UserModel } from "@/model/User.model";
import { getLocal, setLocal, successNotify } from "@/utils";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { BiLogOutCircle } from "react-icons/bi";
import { VscColorMode } from "react-icons/vsc";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { dataTheme } from "./layout/ChatLayout";

interface SidebarProps {
  open: boolean;
  handleClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleClose, open }) => {
  const { user, socket, setUserOnline } = React.useContext(AuthContext);

  const [indexTheme, setIndexTheme] = React.useState(-1);

  React.useEffect(() => {
    const currentTheme = getLocal("data-theme") || "dracula";
    document?.querySelector("html")?.setAttribute("data-theme", currentTheme);
    setIndexTheme(dataTheme.indexOf(currentTheme));
  }, []);

  React.useEffect(() => {
    if (indexTheme !== -1) {
      document
        ?.querySelector("html")
        ?.setAttribute("data-theme", dataTheme[indexTheme]);
      localStorage && setLocal("data-theme", dataTheme[indexTheme]);
    }
  }, [indexTheme]);

  const router = useRouter();
  const handleLogout = () => {
    deleteCookie("token");
    handleClose();
    router.reload();
    socket.current.disconnect();
    socket.current.on("get-user-active", (users: UserModel[]) => {
      setUserOnline(users);
    });
  };

  return (
    <div>
      <div
        className={`z-[60] fixed inset-0 bg-[rgba(0,0,0,0.7)] ${
          !open && "hidden"
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`py-4 px-2 fixed transition-transform z-[70] bg-base-100 shadow-lg w-[70%] md:w-[250px] top-0 left-0 tr bottom-0 ${
          open ? "translate-x-0" : "translate-x-[-100%]"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-16 aspect-[1/1] rounded">
            <LazyLoadImage
              src={user?.avatar}
              className="rounded-full"
              effect="blur"
            />
          </div>
          <h3>{user?.name}</h3>
        </div>
        <div className="divider">FIRECHAT</div>
        <ul className="mt-4 menu bg-base-100 w-full">
          <li
            onClick={() => {
              if (indexTheme === dataTheme.length - 1) {
                successNotify(`Theme ${dataTheme[0]}`);
                setIndexTheme(0);
              } else {
                const newIndex = indexTheme + 1;
                successNotify(`Theme ${dataTheme[newIndex]}`);
                setIndexTheme(newIndex);
              }
            }}
          >
            <a>
              <div className="flex items-center space-x-2">
                <VscColorMode fontSize={22} />
                <span>Giao diện</span>
              </div>
            </a>
          </li>
          <li onClick={handleLogout}>
            <a>
              <div className="flex items-center space-x-2">
                <BiLogOutCircle fontSize={22} />
                <span>Đăng xuất</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
