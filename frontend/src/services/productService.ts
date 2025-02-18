export const fetchProducts = async () => {
  console.log("API URL:", import.meta.env.VITE_API_URL); // ✅ Verifica que la variable de entorno se está leyendo

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Llamada de prueba para verificar que todo funciona correctamente
console.log("API URL desde llamada de prueba:", import.meta.env.VITE_API_URL); // ✅ Otra verificación

fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log("Productos obtenidos:", data))
  .catch((error) => console.error("Error en la llamada a la API:", error));
