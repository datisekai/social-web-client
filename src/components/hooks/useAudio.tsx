import { useMemo, useEffect, useState } from "react";

const useAudio = (url: string) => {
  const [audio] = useState<any>(typeof Audio !== "undefined" && new Audio(url)); //this will prevent rendering errors on NextJS since NodeJs doesn't recognise HTML tags neither its libs.
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  useEffect(() => {
    isPlaying ? audio?.play() : audio?.pause();
  }, [isPlaying]);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  return [play, pause];
};

export default useAudio;
