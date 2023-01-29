import { toast } from "react-hot-toast";

export const successNotify = (message: string) =>
  toast(message, {
    icon: "👏",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });

export const errorNotify = (message: string) => toast.error(message);

export const setLocal = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getLocal = (key: string) => {
  return localStorage.getItem(key) || 'dracula';
};


export const localeFunc = (number: number, index: number, totalSec: number) => {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  return [
    ['just now', 'vừa gửi'],
    ['%s seconds ago', '%s trước'],
    ['1 minute ago', '1 phút trước'],
    ['%s minutes ago', '%s phút trước'],
    ['1 hour ago', '1 giờ trước'],
    ['%s hours ago', '%s giờ trước'],
    ['1 day ago', 'hôm qua'],
    ['%s days ago', '%s ngày trước'],
    ['1 week ago', '1 tuần trước'],
    ['%s weeks ago', '%s tuần trước'],
    ['1 month ago', '1 tháng trước'],
    ['%s months ago', '%s tháng trước'],
    ['1 year ago', '1 năm trước'],
    ['%s years ago', '%s năm trước']
  ][index];
};