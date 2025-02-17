import { useEffect, useState, ReactNode } from "react";
import { User } from "../types/auth";
import { AuthContext } from "./AuthContext";


// 🔹 Definimos el `AuthProvider`
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en autenticación");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      
      return true;
    } catch (error) {
      console.error("🚨 Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };

