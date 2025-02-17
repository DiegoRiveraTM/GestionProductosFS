import { useAuth } from "../hooks/useAuth"; // ✅ Corrección de la importación
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
