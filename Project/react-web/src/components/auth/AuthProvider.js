import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";
import React from "react";

const AuthProvider = ({ children }) => {
  const token = Cookies.get("x_auth");
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!token);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
