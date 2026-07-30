import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
  loginMock: (role: "TENANT" | "LANDLORD" | "ADMIN") => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isLoading: false });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null, isLoading: false });
  },
  initialize: () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      set({ user, token, isLoading: false });
    } catch (e) {
      console.error("Failed to initialize auth store:", e);
      set({ user: null, token: null, isLoading: false });
    }
  },
  loginMock: (role) => {
    const mockUser: User = {
      id: "mock-id-123",
      name: role === "ADMIN" ? "Admin User" : role === "LANDLORD" ? "Sarah Landlord" : "Alex Tenant",
      email: `${role.toLowerCase()}@rentnest.com`,
      role,
      avatar: role === "ADMIN" 
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        : role === "LANDLORD"
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    };
    const mockToken = `mock-token-${role.toLowerCase()}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
    set({ user: mockUser, token: mockToken, isLoading: false });
  },
}));
