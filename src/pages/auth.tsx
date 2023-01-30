import BoxLogin from "@/components/Auth/BoxLogin";
import BoxRegister from "@/components/Auth/BoxRegister";
import useWindowSize from "@/components/hooks/useWindowSize";
import Meta from "@/components/Meta";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Auth = () => {
  const router = useRouter();
  const { action = "login" } = router.query;

  const {height, width} = useWindowSize()


  return (
    <>
      <Meta
        description="Đăng nhập, đăng ký để kết nối với bạn bè"
        title="Xác thực người dùng | FIRECHAT"
        image="/logo.png"
      />
      <div className="flex items-center justify-center" style={{height}}>
        <div>
          <div className="w-[100px] text-center mx-auto aspect-square">
            <LazyLoadImage
              src="/logo.png"
              effect="blur"
              className="rounded-full "
            />
          </div>

          <h1 className="mt-4 text-xl md:text-2xl">
            Kết nối với những người bạn yêu quý
          </h1>

          <div className="card  mx-auto w-full max-w-sm shadow-white mt-4 shadow-md bg-base-300">
            <div className="tab py-2">
              <div
                onClick={() =>
                  router.push({
                    query: {
                      action: "login",
                    },
                  })
                }
                className={`tab tab-bordered ${
                  action === "login" && "tab-active"
                }`}
              >
                Đăng nhập
              </div>
              <div
                onClick={() =>
                  router.push({
                    query: {
                      action: "register",
                    },
                  })
                }
                className={`tab tab-bordered ${
                  action === "register" && "tab-active"
                }`}
              >
                Đăng ký
              </div>
            </div>
            {action === "register" ? <BoxRegister /> : <BoxLogin />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies["token"];

  if (token) {
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
};
