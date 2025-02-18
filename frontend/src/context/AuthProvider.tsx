import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./authContext";
import { User } from "../types/auth";

// 📌 Verificar si la URL de la API está definida
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("❌ VITE_API_URL no está definido. Revisa tu .env");
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("❌ Error al parsear los datos del usuario:", error);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!API_URL) {
      alert("⚠ Error: La URL de la API no está configurada correctamente.");
      return false;
    }

    try {
      console.log("📡 Iniciando sesión en:", `${API_URL}/auth/login`);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en autenticación");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      console.log("✅ Inicio de sesión exitoso:", data.user);
      return true;
    } catch (error) {
      console.error("🚨 Error en login:", error);
      alert(`❌ Error en autenticación: ${error}`);
      return false;
    }
  };

  const logout = () => {
    try {
      console.log("🚪 Cerrando sesión...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ Sesión cerrada.");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
