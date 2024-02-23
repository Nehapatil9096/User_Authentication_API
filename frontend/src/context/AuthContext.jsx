// AuthContext.jsx
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

  // Ensure setAuthUser is passed as part of the context value
  const contextValue = {
    authUser,
    setAuthUser,
    setAuthUserData: (userData) => {
      // Update authUser state and localStorage
      setAuthUser(userData);
      localStorage.setItem("chat-user", JSON.stringify(userData));
    },
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
