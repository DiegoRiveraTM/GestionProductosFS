"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { UserPlus, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Aurora from "../components/Aurora";
import BlurText from "../components/BlurText";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  name: string | null;
  email: string | null;
  password: string | null;
}

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    name: null,
    email: null,
    password: null,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    password: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const validateField = useCallback((name: string, value: string) => {
    switch (name) {
      case "name":
        if (value.length === 0) return "El nombre es requerido";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre solo debe contener letras";
        return null;

      case "email":
        if (value.length === 0) return "El correo electrónico es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingrese un correo electrónico válido";
        return null;

      case "password":
        if (value.length === 0) return "La contraseña es requerida";
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        if (!/\d/.test(value)) return "La contraseña debe contener al menos un número";
        if (!/[A-Z]/.test(value)) return "La contraseña debe contener al menos una mayúscula";
        if (!/[a-z]/.test(value)) return "La contraseña debe contener al menos una minúscula";
        return null;

      default:
        return null;
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
    });

    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await register(formData);
      localStorage.setItem("token", data.token);

      // Mostrar mensaje de éxito
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/products");
      }, 2500);
    } catch (err) {
      const maybeError = err as { response?: { data?: { message?: string } } };
      setError(maybeError.response?.data?.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const memoizedAurora = useMemo(
    () => <Aurora colorStops={["#1a0b2e", "#4b1167", "#064e3b"]} speed={0.3} amplitude={0.8} />,
    []
  );

  const memoizedBlurText = useMemo(
    () => (
      <BlurText
        text="Gestión De Productos"
        animateBy="words"
        delay={100}
        direction="top"
        className="text-4xl font-bold text-center text-purple-100"
      />
    ),
    []
  );

  const renderFieldStatus = (fieldName: keyof ValidationErrors) => {
    const value = formData[fieldName];
    if (!touched[fieldName] || value.length === 0) return null;

    return errors[fieldName] ? (
      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
    ) : (
      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
    );
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] via-[#4b1167] to-[#064e3b]">
      <div className="absolute inset-0 w-full h-full">{memoizedAurora}</div>

      <header className="absolute top-0 left-0 w-full p-4 flex justify-end bg-black/50 backdrop-blur-md z-20">
        <button onClick={() => navigate("/auth")} className="text-white hover:text-emerald-300 transition-all">
          Iniciar Sesión
        </button>
      </header>

      <div className="absolute top-20 w-full flex justify-center z-10">{memoizedBlurText}</div>

      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl border border-purple-900/20">
          <h2 className="mb-6 text-3xl font-bold text-center text-purple-100">Registro</h2>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-200 rounded bg-red-900/20 border border-red-800/50 flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {showSuccess && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-3 text-sm bg-emerald-600 text-white rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out">
              <CheckCircle2 size={20} />
              Registro exitoso 🎉
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                spellCheck="false"
                className={`w-full px-4 py-3 text-white placeholder-purple-300/40 border rounded-lg bg-purple-950/30 border-purple-800/30 focus:outline-none transition-all pr-10 ${
                  touched.name && formData.name.length > 0
                    ? errors.name
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30'
                      : 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30'
                    : 'border-purple-800/30 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/50'
                }`}
              />
              {renderFieldStatus('name')}
              {touched.name && formData.name.length > 0 && errors.name && (
                <div className="absolute left-0 -bottom-6 flex items-center gap-2 px-3 py-1 text-sm text-red-200">
                  <AlertTriangle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                spellCheck="false"
                className={`w-full px-4 py-3 text-white placeholder-purple-300/40 border rounded-lg bg-purple-950/30 border-purple-800/30 focus:outline-none transition-all pr-10 ${
                  touched.email && formData.email.length > 0
                    ? errors.email
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30'
                      : 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30'
                    : 'border-purple-800/30 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/50'
                }`}
              />
              {renderFieldStatus('email')}
              {touched.email && formData.email.length > 0 && errors.email && (
                <div className="absolute left-0 -bottom-6 flex items-center gap-2 px-3 py-1 text-sm text-red-200">
                  <AlertTriangle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                spellCheck="false"
                className={`w-full px-4 py-3 text-white placeholder-purple-300/40 border rounded-lg bg-purple-950/30 border-purple-800/30 focus:outline-none transition-all pr-10 ${
                  touched.password && formData.password.length > 0
                    ? errors.password
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30'
                      : 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30'
                    : 'border-purple-800/30 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/50'
                }`}
              />
              {renderFieldStatus('password')}
              {touched.password && formData.password.length > 0 && errors.password && (
                <div className="absolute left-0 -bottom-6 flex items-center gap-2 px-3 py-1 text-sm text-red-200">
                  <AlertTriangle size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white transition-all rounded-lg bg-emerald-900/80 hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-700/50 flex items-center justify-center gap-2 mt-8"
              disabled={loading}
            >
              <UserPlus size={20} />
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;