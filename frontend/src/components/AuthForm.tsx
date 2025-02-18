import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Verificar que la URL de la API se obtiene correctamente
  console.log("API_URL:", import.meta.env.VITE_API_URL);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiBaseUrl = import.meta.env.VITE_API_URL; // Asegurar que la URL esté correcta
    if (!apiBaseUrl) {
      alert("⚠ Error: La URL de la API no está definida en las variables de entorno.");
      return;
    }

    const url = isRegister
      ? `${apiBaseUrl}/auth/register`
      : `${apiBaseUrl}/auth/login`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert(`✅ ${isRegister ? "Registro" : "Inicio de sesión"} exitoso`);
        navigate("/products"); // Redirigir después de registrarse o iniciar sesión
      } else {
        alert(`❌ Error: ${data.message || "Ocurrió un problema"}`);
      }
    } catch (error) {
      console.error("❌ Error en la autenticación:", error);
      alert("⚠ Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isRegister ? "Registro" : "Inicio de Sesión"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            className="text-blue-500"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
