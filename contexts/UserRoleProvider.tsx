import { useEffect, useState, createContext } from "react";

type contextType = {
  isFan: boolean;
  switchRole: () => void;
};

export const UserRoleContext = createContext<contextType>({
  isFan: true,
  switchRole: () => {},
});

export const UserRoleProvider = ({ children }: any) => {
  const [isFan, setIsFan] = useState(true);

  const switchRole = () => {
    if (
      localStorage.getItem("role") === null ||
      localStorage.getItem("role") === "fan"
    ) {
      localStorage.setItem("role", "creator");
      setIsFan(false);
    } else if (localStorage.getItem("role") === "creator") {
      localStorage.setItem("role", "fan");
      setIsFan(true);
    }
  };

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

  return (
    <UserRoleContext.Provider value={{ isFan, switchRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
