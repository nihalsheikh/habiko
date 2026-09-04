import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import type { User } from "./api";

// Theme Context
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggle: (event?: ReactMouseEvent | MouseEvent) => Promise<void> | void;
  setTheme: (
    theme: Theme | ((prev: Theme) => Theme),
    event?: ReactMouseEvent | MouseEvent,
  ) => Promise<void> | void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

// Auth Context
export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (u: User) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
