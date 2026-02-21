// src/context/AuthContext.tsx
// Drop this file into your src/context/ folder

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  toggleWishlist: (sareeId: string) => Promise<boolean>;
  isInWishlist: (sareeId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("silk_token");
    if (token) {
      authApi.getProfile()
        .then(setUser)
        .catch(() => localStorage.removeItem("silk_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem("silk_token", token);
    setUser(user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { token, user } = await authApi.signup(name, email, password);
    localStorage.setItem("silk_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("silk_token");
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const res = await authApi.updateProfile(data);
    setUser(res.user);
  };

  const toggleWishlist = async (sareeId: string): Promise<boolean> => {
    const res = await authApi.toggleWishlist(sareeId);
    setUser((prev) => prev ? { ...prev, wishlist: res.wishlist } : prev);
    return res.added;
  };

  const isInWishlist = (sareeId: string) =>
    user?.wishlist?.includes(sareeId) ?? false;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, signup, logout, updateUser, toggleWishlist, isInWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
