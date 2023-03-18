import { useEffect, useState } from "react";

export const useUserRole = () => {
  const [isFan, setIsFan] = useState(true);

  useEffect(() => {
    const getRole = () => {
      if (
        localStorage.getItem("role") === null ||
        localStorage.getItem("role") === "fan"
      ) {
        setIsFan(true);
      } else if (localStorage.getItem("role") === "creator") {
        setIsFan(false);
      }
    };

    getRole();
  }, []);

  return [isFan, setIsFan] as const;
};
