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
  "https://gestion-productos-fs.vercel.app", // Corregido
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔄 **Manejar solicitudes preflight**
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).send();
});

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
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportamos `app` para pruebas con Jest (o cualquier otro test runner)
export default app;
