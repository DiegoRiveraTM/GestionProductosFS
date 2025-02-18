"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/authHooks";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Loader2 } from "lucide-react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import Aurora from "../components/Aurora";
import type { Product } from "../types/product";

export const ProductPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user?.token) return;
  
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
  
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
  
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [user?.token]);

  const addProduct = useCallback(
    async (newProduct: { name: string; price: number; description: string }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(newProduct),
        });
  
        if (!res.ok) throw new Error("No se pudo agregar el producto");
  
        const data: Product = await res.json();
        setProducts((prevProducts) => [...prevProducts, { ...data, id: data._id }]);
        setShowForm(false);
      } catch (err) {
        console.error("Error al agregar producto:", err);
        setError("Error al agregar producto.");
      }
    },
    [user?.token]
  );
  
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        });
  
        if (!res.ok) throw new Error("No se pudo eliminar el producto");
  
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        setError("Error al eliminar producto.");
      }
    },
    [user?.token]
  );
  
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Memoriza Aurora para evitar re-render innecesarios
  const memoizedAurora = useMemo(
    () => (
      <Aurora colorStops={["#1a0b2e", "#4b1167", "#064e3b"]} speed={0.3} amplitude={0.8} />
    ),
    []
  );

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] via-[#4b1167] to-[#064e3b]">
      {/* Aurora Background */}
      <div className="absolute inset-0 w-full h-full">{memoizedAurora}</div>

      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-end bg-black/50 backdrop-blur-md z-20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg transition-all"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido de la página */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <div className="w-full max-w-5xl p-8 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl border border-purple-900/20">
          <h2 className="mb-6 text-3xl font-bold text-center text-purple-100">
            Gestión de Productos
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
              <p className="mt-4 text-purple-200/80">Cargando productos...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Botón para agregar producto o formulario */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-lg transition-all"
                >
                  <Plus size={20} />
                  Agregar Producto
                </button>
              ) : (
                <div className="bg-purple-950/30 rounded-lg p-6 backdrop-blur-sm border border-purple-900/20">
                  <ProductForm onAdd={addProduct} />
                </div>
              )}

              {/* Tabla de productos */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-purple-200/60">No hay productos disponibles.</p>
                </div>
              ) : (
                <div className="bg-purple-950/30 rounded-lg backdrop-blur-sm overflow-hidden border border-purple-900/20">
                  <ProductTable products={products} onDelete={deleteProduct} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
