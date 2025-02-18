import { Trash2 } from "lucide-react";
import type { Product } from "../types/product";
import { memo } from "react";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = memo(({ products, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-purple-900/30 bg-purple-950/40">
      <table className="w-full text-sm text-left text-white border-collapse">
        {/* Encabezado de la tabla */}
        <thead className="text-xs uppercase bg-purple-900/40 text-purple-300">
          <tr>
            <th scope="col" className="px-6 py-3">Nombre</th>
            <th scope="col" className="px-6 py-3">Precio</th>
            <th scope="col" className="px-6 py-3">Descripción</th>
            <th scope="col" className="px-6 py-3 text-center">Acción</th>
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={product._id}
                className={`bg-purple-950/30 ${
                  index === products.length - 1 ? "border-none" : "border-b border-purple-800"
                }`}
              >
                <td className="px-6 py-4 text-white !important" spellCheck="false">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-white !important" spellCheck="false">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-white !important" spellCheck="false">
                  {product.description}
                </td>
                <td className="px-6 py-4 flex justify-center">
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-purple-300">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default ProductTable;
