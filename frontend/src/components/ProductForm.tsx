import { useState } from "react";

interface ProductFormProps {
  onAdd: (product: { name: string; price: number; description: string }) => void;
}

const ProductForm = ({ onAdd }: ProductFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState(""); // ✅ Agregamos campo description

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return alert("Todos los campos son obligatorios.");

    onAdd({ name, price: Number(price), description }); // ✅ Enviamos description también
    setName("");
    setPrice("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Agregar Producto
      </button>
    </form>
  );
};

export default ProductForm;

