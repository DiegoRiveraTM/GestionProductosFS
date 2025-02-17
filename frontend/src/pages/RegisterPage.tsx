import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await register(formData);
      localStorage.setItem("token", data.token); // Guardamos el token
      navigate("/products"); // Redirige al usuario a la página de productos
    } catch (err: unknown) {
      if ((err as { response?: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError("Error en el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/auth")}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
