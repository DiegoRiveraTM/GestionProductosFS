import React from "react";
import { Product } from "../types/product";

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<Props> = ({ products, onDelete }) => {
  console.log("📦 Renderizando productos en la tabla:", products); // 🔥 DEBUGGING

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Nombre</th>
          <th className="border border-gray-300 px-4 py-2">Precio</th>
          <th className="border border-gray-300 px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product) => (
            <tr key={product._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{product.name}</td>
              <td className="border border-gray-300 px-4 py-2">${product.price}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => onDelete(product._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-gray-500 py-4">
              📭 No hay productos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;
