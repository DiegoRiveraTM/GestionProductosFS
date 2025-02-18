"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

interface ProductFormProps {
  onAdd: (product: { name: string; price: number; description: string }) => void;
}

interface FormErrors {
  name: string | null;
  price: string | null;
  description: string | null;
}

export default function ProductForm({ onAdd }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    price: null,
    description: null,
  });

  const [visibleErrors, setVisibleErrors] = useState<{ [key: string]: boolean }>({
    name: false,
    price: false,
    description: false,
  });

  const [exitingErrors, setExitingErrors] = useState<{ [key: string]: boolean }>({
    name: false,
    price: false,
    description: false,
  });

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "name":
        if (value.trim() === "") return "El nombre es requerido";
        if (/^\d+$/.test(value)) return "El nombre no puede ser solo números";
        return null;
      case "price":
        if (value === "") return "El precio es requerido";
        {
          const parsedPrice = Number.parseFloat(value);
          if (isNaN(parsedPrice)) return "El precio debe ser un número válido";
          if (parsedPrice > 50000) return "Usa una cantidad real (máximo 50,000)";
          return null;
        }
      case "description":
        return value.trim() === "" ? "La descripción es requerida" : null;
      default:
        return null;
    }
  };

  const showError = useCallback((fieldName: string) => {
    setExitingErrors((prev) => ({ ...prev, [fieldName]: false }));
    setVisibleErrors((prev) => ({ ...prev, [fieldName]: true }));

    setTimeout(() => {
      setExitingErrors((prev) => ({ ...prev, [fieldName]: true }));
    }, 2700);

    setTimeout(() => {
      setVisibleErrors((prev) => ({ ...prev, [fieldName]: false }));
      setExitingErrors((prev) => ({ ...prev, [fieldName]: false }));
    }, 3000);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [id]: id === "price" ? value.replace(/[^0-9.]/g, "") : value,
      }));

      const error = validateField(id, value);
      setErrors((prev) => ({
        ...prev,
        [id]: error,
      }));

      if (error) {
        showError(id);
      }
    },
    [showError]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      price: validateField("price", formData.price),
      description: validateField("description", formData.description),
    };

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, error]) => {
      if (error) {
        showError(field);
      }
    });

    if (Object.values(newErrors).every((error) => error === null)) {
      const parsedPrice = Number.parseFloat(formData.price);
      onAdd({
        name: formData.name,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        description: formData.description,
      });

      setFormData({ name: "", price: "", description: "" });
    }
  };

  const renderFieldError = (fieldName: keyof FormErrors) => {
    if (errors[fieldName] && visibleErrors[fieldName]) {
      return (
        <div
          className={`
            absolute right-0 top-0 -translate-y-1 transform px-3 py-1 
            text-sm bg-red-500/90 text-white rounded-md shadow-lg 
            flex items-center gap-2 
            transition-all duration-300 ease-in-out
            ${exitingErrors[fieldName] ? "opacity-0 translate-y-0 scale-95" : "opacity-100 -translate-y-1 scale-100"}
            animate-in zoom-in-95 duration-300
          `}
          style={{
            animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <AlertTriangle
            size={14}
            className={`
              transition-transform duration-300
              ${exitingErrors[fieldName] ? "scale-95" : "scale-100"}
            `}
          />
          <span
            className={`
            transition-all duration-300
            ${exitingErrors[fieldName] ? "opacity-0" : "opacity-100"}
          `}
          >
            {errors[fieldName]}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="relative">
          <label htmlFor="name" className="block text-sm font-medium text-purple-200/80 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            spellCheck="false"
            className={`w-full px-4 py-2 bg-purple-950/30 border rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 transition-all ${
              errors.name && visibleErrors.name
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                : "border-purple-800/30 focus:border-emerald-700/50 focus:ring-emerald-700/50"
            }`}
            placeholder="Nombre del producto"
          />
          {renderFieldError("name")}
        </div>

        {/* Precio */}
        <div className="relative">
          <label htmlFor="price" className="block text-sm font-medium text-purple-200/80 mb-1">
            Precio
          </label>
          <input
            type="text"
            id="price"
            value={formData.price}
            onChange={handleChange}
            autoComplete="off"
            spellCheck="false"
            className={`w-full px-4 py-2 bg-purple-950/30 border rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 transition-all ${
              errors.price && visibleErrors.price
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                : "border-purple-800/30 focus:border-emerald-700/50 focus:ring-emerald-700/50"
            }`}
            placeholder="0.00"
          />
          {renderFieldError("price")}
        </div>
      </div>

      {/* Descripción */}
      <div className="relative">
        <label htmlFor="description" className="block text-sm font-medium text-purple-200/80 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-purple-950/30 border border-purple-800/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 resize-none transition-all"
          placeholder="Descripción del producto"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-lg transition-all">
          Guardar Producto
        </button>
      </div>
    </form>
  );
}
