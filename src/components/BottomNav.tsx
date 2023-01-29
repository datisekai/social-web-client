import { useRouter } from "next/router";
import React from "react";
import { dataSidebar } from "./layout/ChatLayout";

const BottomNav = () => {

  const router = useRouter()
  return (
    <div className="btm-nav z-50 flex md:hidden">
      {dataSidebar.map((item) => {
        const Icon = item.icon;

        return (
          <button key={item.url} onClick={() => router.push(item.url)} className={`${router.asPath.includes(item.url) && 'active'}`}>
            <Icon fontSize={20} />
            <span className="btm-nav-label">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
