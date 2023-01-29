import AuthAction from "@/actions/Auth.action";
import { AuthContext } from "@/context/AuthContext";
import { UserModel } from "@/model/User.model";
import { errorNotify, successNotify } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "../Form/Input";

const BoxLogin = () => {
  const { socket, setUserOnline } = React.useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate, isLoading } = useMutation(AuthAction.login, {
    onSuccess: (data) => {
     
      setCookie("token", data.token);
      router.push("/");
      successNotify("Đăng nhập thành công");
    },
    onError: (err: any) => {
      errorNotify(err);
    },
  });

  const handleLogin = (data: any) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="card-body">
        <Input
          control={control}
          error={errors}
          name="phone"
          label="Số điện thoại"
          placeholder="Số điện thoại"
          rules={{
            pattern: {
              message: "Vui lòng nhập đúng định dạng",
              value:
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            },
            required: "Không được bỏ trống",
          }}
        />
        <Input
          control={control}
          error={errors}
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Mật khẩu"
          rules={{
            required: "Không được bỏ trống",
          }}
        />
        <label className="label">
          <div className="label-text-alt link link-hover">Quên mật khẩu</div>
        </label>

        <div className="form-control mt-6">
          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-primary"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </form>
  );
};

export default BoxLogin;
