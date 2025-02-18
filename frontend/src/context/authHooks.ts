import { useContext } from "react";
import { AuthContext } from "../context/authContext"; // ✅ Corrección de importación

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de un AuthProvider");
  }
  return context;
};
