export const fetchProducts = async () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  if (!API_URL) {
    console.error("❌ VITE_API_URL no está definido. Revisa tu .env");
    return null;
  }

  console.log("📡 Obteniendo productos desde:", `${API_URL}/products`);

  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Productos obtenidos correctamente:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return null;
  }
};

// 📌 Llamada de prueba para verificar que la API responde correctamente
const testFetchProducts = async () => {
  console.log("📡 API URL desde prueba:", import.meta.env.VITE_API_URL);

  const data = await fetchProducts();
  if (data) {
    console.log("✅ Productos obtenidos en prueba:", data);
  } else {
    console.error("❌ No se pudieron obtener los productos.");
  }
};

// Ejecutar prueba al cargar el archivo
testFetchProducts();
