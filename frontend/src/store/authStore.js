import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Initial state — load from localStorage so user stays logged in on refresh
  user: JSON.parse(localStorage.getItem("user") || "null"),

  // Actions
  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useAuthStore;
