import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "../Form/Input";
import { useMutation } from "@tanstack/react-query";
import AuthAction from "@/actions/Auth.action";
import { setCookie } from "cookies-next";
import { errorNotify, successNotify } from "@/utils";
import { AuthContext } from "@/context/AuthContext";
import { UserModel } from "@/model/User.model";

const BoxRegister = () => {
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
      name: "",
    },
  });

  const router = useRouter();

  const { mutate, isLoading } = useMutation(AuthAction.register, {
    onSuccess: (data) => {
      setCookie("token", data.token);
      router.push("/");
      successNotify("Đăng ký thành công");
    },
    onError: (err: any) => {
      errorNotify(err);
    },
  });

  const handleRegister = (data: any) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <div className="card-body">
        <Input
          control={control}
          error={errors}
          name="name"
          label="Tên hiển thị"
          placeholder="Tên hiển thị"
          rules={{
            required: "Không được bỏ trống",
          }}
        />
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
          label="Mật khẩu"
          placeholder="Mật khẩu"
          rules={{
            required: "Không được bỏ trống",
          }}
        />
        <div className="form-control mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            onClick={handleSubmit(handleRegister)}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </form>
  );
};

export default BoxRegister;
