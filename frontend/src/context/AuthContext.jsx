import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [role, setRole] = useState(authUser?.role || null);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("user", JSON.stringify(authUser));
      setRole(authUser.role);
    }
  }, [authUser]);

  const setAuthUserData = (userData) => {

    // Update authUser state with new data including role
    const updatedUser = { ...authUser, ...userData, role: userData.role || "user" };
    setAuthUser(updatedUser);
    setRole(updatedUser.role);
    localStorage.setItem("user", JSON.stringify(updatedUser));

  };

  const logout = () => {
    setAuthUser(null);
    setRole(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authUser, role, setAuthUser, setAuthUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
