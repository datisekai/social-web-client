import axios, { AxiosResponse } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const SERVER_URL = BASE_URL + "/api";

export const SOCKET_URL = BASE_URL?.replace(BASE_URL.includes('http') ? 'http' : 'https','ws') || "";

export const server = axios.create({
  baseURL: SERVER_URL,
});

server.interceptors.request.use((config: any) => {
  if (config.url?.indexOf("auth") !== -1) {
    return config;
  }

  if (!config?.headers) {
    throw new Error(
      `Expected 'config' and 'config.headers' not to be undefined`
    );
  }

  const token = getCookie("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

server.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
        deleteCookie("token");
      }
    }
    return Promise.reject(error?.response?.data);
  }
);
