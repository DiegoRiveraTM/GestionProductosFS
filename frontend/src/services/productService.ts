export const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/products", {
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


fetch("http://localhost:5000/api/products", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));