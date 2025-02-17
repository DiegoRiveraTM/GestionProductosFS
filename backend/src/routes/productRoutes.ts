import express from "express";
import Product from "../models/Product";
import { protect } from "../middleware/authMiddleware";
import { IUser } from "../models/User"; // Importar IUser

// Extender el tipo de Request con el usuario autenticado
interface AuthRequest extends express.Request {
  user?: IUser & { _id: string };
}

const router = express.Router();

// 📌 Crear un producto (Solo usuarios autenticados)
router.post("/", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const product = new Product({ ...req.body, user: req.user._id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

// 📌 Obtener productos del usuario autenticado
router.get("/", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
  }
});

// 📌 Obtener un producto por ID (Público)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
});

// 📌 Actualizar un producto
router.put("/:id", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    if (product.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "No tienes permisos para modificar este producto" });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

// 📌 Eliminar un producto
router.delete("/:id", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    if (product.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "No tienes permisos para eliminar este producto" });
      return;
    }

    await product.deleteOne();
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
