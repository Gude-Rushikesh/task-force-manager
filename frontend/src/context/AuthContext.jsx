/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("taskforce_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("taskforce_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("taskforce_token", data.token);
    localStorage.setItem("taskforce_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("taskforce_token");
    localStorage.removeItem("taskforce_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "Admin",
      isManager: user?.role === "Manager",
      canManage: ["Admin", "Manager"].includes(user?.role),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
