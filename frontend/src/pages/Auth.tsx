import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Importamos `useAuth` correctamente
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await login(email, password);
      if (token) {
        navigate("/products");
      } else {
        setError("⚠️ Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("🚨 Error al iniciar sesión:", err);
      setError("⚠️ Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">🔑 Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo Electrónico"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            🚀 Iniciar Sesión
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
