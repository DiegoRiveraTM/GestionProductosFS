import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middleware para JSON y CORS
app.use(express.json());
// 🔥 Habilita CORS para todas las solicitudes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Asegura que coincida con tu frontend
  credentials: true
}));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

// Iniciar el servidor solo si no está en modo de test
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
}

// Exportamos `app` para pruebas con Jest
export default app;
