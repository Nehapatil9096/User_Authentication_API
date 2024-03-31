// AuthContext.jsx
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // Ensure setAuthUser is passed as part of the context value
  const contextValue = {
    authUser,
    setAuthUser,
    setAuthUserData: (userData) => {
      console.log("Incoming userData:", userData);

      // Update authUser state and localStorage
      const updatedUser = { ...authUser, cards: mergedCards, ...userData };
      setAuthUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("Updated authUser:", updatedUser);
    },
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
