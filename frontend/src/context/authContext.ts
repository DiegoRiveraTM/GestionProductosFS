import { createContext } from "react";
import { User } from "../types/auth";

export interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
