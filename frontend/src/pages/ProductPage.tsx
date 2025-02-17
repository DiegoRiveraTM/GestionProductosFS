import { useEffect, useState } from "react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/authHooks";
import { Product } from "../types/product";
import { useNavigate } from "react-router-dom";

export const ProductPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // ✅ Estado para mostrar formulario

  useEffect(() => {
    console.log("🛂 Usuario autenticado en ProductPage:", user);
    console.log("🔑 Token enviado en la petición:", user?.token);
    if (!user?.token) return;
  
    const fetchProducts = async () => {
      try {
        console.log("⏳ Enviando solicitud a la API...");
        const res = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
  
        console.log("🔍 Respuesta HTTP:", res.status);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("📦 Productos recibidos en el frontend:", data);
  
        setProducts(data);
      } catch (err) {
        console.error("🚨 Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [user, user?.token]);
  

  const addProduct = async (newProduct: { name: string; price: number; description: string }) => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("No se pudo agregar el producto");

      const data: Product = await res.json();
      console.log("✅ Producto agregado:", data);

      setProducts((prevProducts) => [...prevProducts, { ...data, id: data._id }]);
      setShowForm(false); // ✅ Oculta el formulario después de agregar producto
    } catch (err) {
      console.error("🚨 Error al agregar producto:", err);
      alert("Error al agregar producto.");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) throw new Error("No se pudo eliminar el producto");

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      console.log("🗑️ Producto eliminado:", id);
    } catch (err) {
      console.error("🚨 Error al eliminar producto:", err);
      alert("Error al eliminar producto.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          📦 Gestión de Productos
        </h1>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={() => {
            logout();
            navigate("/auth");
          }}
        >
          Cerrar Sesión 🚪
        </button>
      </div>

      {loading ? (
        <p className="text-center">⏳ Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500 text-center">❌ {error}</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-500">📭 No hay productos disponibles.</p>
          {!showForm && (
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
              onClick={() => setShowForm(true)} // ✅ Ahora solo muestra el formulario
            >
              ➕ Agregar Producto
            </button>
          )}
          {showForm && <ProductForm onAdd={addProduct} />}
        </div>
      ) : (
        <>
          <ProductForm onAdd={addProduct} />
          <ProductTable products={products} onDelete={deleteProduct} />
        </>
      )}
    </div>
  );
};

export default ProductPage;
