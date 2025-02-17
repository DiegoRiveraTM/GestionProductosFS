export interface Product {
  _id: string;  // Mantiene `_id` como viene del backend
  id?: string;  // Opcional para el frontend
  name: string;
  price: number;
  description: string;
}
