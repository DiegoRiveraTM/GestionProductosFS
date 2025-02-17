import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../types/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    // Si `storedUser` es `null`, `undefined` o una cadena vacía, evitar `JSON.parse`
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setUser(null);
      }
    } else {
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
  
      const userWithToken = { ...data.user, token: data.token }; // 🔥 Agregar el token al usuario
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userWithToken)); // 🔥 Guardar usuario con token
      setUser(userWithToken);
  
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
