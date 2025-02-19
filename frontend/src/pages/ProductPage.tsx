"use client";

import { API_URL } from "../api/config";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/authHooks";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import Aurora from "../components/Aurora";
import type { Product } from "../types/product";

// 📌 Verificar si la API_URL está definida correctamente
if (!API_URL) {
  console.error("❌ VITE_API_URL no está definido. Revisa tu .env");
}

export const ProductPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  console.log("🛠 API_URL:", API_URL);
  console.log("🧑‍💻 Usuario autenticado:", user);
  console.log("🔑 Token en localStorage:", localStorage.getItem("token"));

  // 📌 Cargar productos desde el backend
  useEffect(() => {
    if (!user?.token && !localStorage.getItem("token")) {
      console.warn("⚠️ Usuario no autenticado, no se cargarán productos.");
      return;
    }

    if (!API_URL) {
      setError("❌ Error: API_URL no está definida.");
      return;
    }

    const fetchProducts = async () => {
      try {
        console.log(`📡 Cargando productos desde: ${API_URL}/products`);

        const token = user?.token || localStorage.getItem("token");

        if (!token) {
          console.error("⚠ No hay token en localStorage, cancelando petición.");
          return;
        }

        const res = await fetch(`${API_URL}/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`❌ Error HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Productos obtenidos:", data);
        setProducts(data);
      } catch (err) {
        console.error("❌ Error al obtener productos:", err);
      }
    };

    fetchProducts();
  }, [user]);

  // 📌 Agregar producto
  const addProduct = useCallback(
    async (newProduct: { name: string; price: number; description: string }) => {
      if (!API_URL) {
        setError("❌ Error: API_URL no está definida.");
        return;
      }

      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        console.error("⚠ No hay token en user, cancelando petición.");
        setError("⚠ No tienes permisos para agregar productos.");
        return;
      }

      try {
        console.log(`📡 Agregando producto a: ${API_URL}/products`);
        console.log("🔑 Token usado en la petición:", token);

        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        });

        console.log("📡 Respuesta de la API:", res.status, res.statusText);

        if (!res.ok) {
          const errorResponse = await res.json();
          console.error("❌ Respuesta de error:", errorResponse);
          throw new Error(`Error ${res.status}: ${errorResponse.message || "No se pudo agregar el producto"}`);
        }

        const data: Product = await res.json();
        console.log("✅ Producto agregado con éxito:", data);
        setProducts((prevProducts) => [...prevProducts, { ...data, id: data._id }]);
        setShowForm(false);
      } catch (err) {
        console.error("❌ Error al agregar producto:", err);

        // ✅ Corrección: Manejo de errores en TypeScript
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("❌ Error desconocido al agregar producto.");
        }
      }
    },
    [user]
  );

  // 📌 Eliminar producto
  const deleteProduct = useCallback(
    async (id: string) => {
      if (!API_URL) {
        setError("❌ Error: API_URL no está definida.");
        return;
      }

      try {
        console.log(`📡 Eliminando producto en: ${API_URL}/products/${id}`);
        const token = user?.token || localStorage.getItem("token");

        if (!token) {
          console.error("⚠ No hay token en user, cancelando petición.");
          setError("⚠ No tienes permisos para eliminar productos.");
          return;
        }

        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo eliminar el producto");

        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } catch (err) {
        console.error("❌ Error al eliminar producto:", err);
        setError("Error al eliminar producto.");
      }
    },
    [user]
  );

  // 📌 Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // 📌 Memoriza el fondo Aurora para evitar re-renders innecesarios
  const memoizedAurora = useMemo(
    () => <Aurora colorStops={["#1a0b2e", "#4b1167", "#064e3b"]} speed={0.3} amplitude={0.8} />,
    []
  );

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] via-[#4b1167] to-[#064e3b]">
      <div className="absolute inset-0 w-full h-full">{memoizedAurora}</div>

      <header className="absolute top-0 left-0 w-full p-4 flex justify-end bg-black/50 backdrop-blur-md z-20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg transition-all"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </header>

      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <div className="w-full max-w-5xl p-8 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl border border-purple-900/20">
          <h2 className="mb-6 text-3xl font-bold text-center text-purple-100">Gestión de Productos</h2>

          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg"><p className="text-red-200 text-center">{error}</p></div>}

          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-lg transition-all">
              <Plus size={20} /> Agregar Producto
            </button>
          ) : (
            <ProductForm onAdd={addProduct} />
          )}

          <ProductTable products={products} onDelete={deleteProduct} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
