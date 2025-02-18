import express, { Request, Response, NextFunction } from "express";
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

// Middleware para parsear JSON
app.use(express.json());

// 🔥 Configurar CORS correctamente
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestionproductosfs.onrender.com", // Backend en producción
  "https://frontend-seven-delta-60.vercel.app", // Frontend en producción
  
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Manejo de rutas inexistentes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Recurso no encontrado" });
});

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error en el servidor:", err);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});

// Iniciar el servidor solo si no está en modo de test
const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

// Exportamos `app` para pruebas con Jest (o cualquier otro test runner)
export default app;
