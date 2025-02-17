import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  user: mongoose.Types.ObjectId; // ✅ Relación con el usuario
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Relación con el usuario
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
