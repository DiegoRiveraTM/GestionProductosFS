// src/routes/authRoutes.ts
import express from "express";
import { check, validationResult } from "express-validator";
import { registerHandler, loginHandler } from "../controllers/authController";

const router = express.Router();

// Middleware de validación
const validateRequest: express.RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Rutas de autenticación con validaciones
router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("Debe ser un email válido"),
    check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener mínimo 6 caracteres"),
    validateRequest,
  ],
  registerHandler
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Debe ser un email válido"),
    check("password").exists().withMessage("La contraseña es obligatoria"),
    validateRequest,
  ],
  loginHandler
);

export default router;
