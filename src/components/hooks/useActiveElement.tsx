import React, { useState, useEffect } from "react";

const useActiveElement = () => {
  const [active, setActive] = useState<any>();

  const handleFocusIn = (e: any) => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("visibilitychange", (e) => {
      if (document.hidden) {
        setActive(null);
      }
    });
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return active;
};

export default useActiveElement;
