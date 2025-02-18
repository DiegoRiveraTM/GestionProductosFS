export const fetchProducts = async () => {
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
fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error en la llamada a la API:", error));
