import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User"; // Asegúrate de importar IUser
import { Types } from "mongoose"; // Importar Types para manejar ObjectId

// Extender la interfaz Request con el usuario autenticado
interface AuthRequest extends Request {
  user?: IUser & { _id: string }; // ✅ Aseguramos que _id es string
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "Usuario no encontrado" });
        return;
      }

      // ✅ Convertimos `_id` a string y hacemos un casting correcto
      req.user = {
        _id: (user._id as Types.ObjectId).toHexString(),
        name: user.name,
        email: user.email,
        password: user.password, 
        matchPassword: user.matchPassword, // Mantiene métodos de la interfaz IUser
      } as IUser & { _id: string };

      next();
      return;
    } catch (error) {
      res.status(401).json({ message: "No autorizado, token inválido" });
      return;
    }
  }

  res.status(401).json({ message: "No autorizado, token no encontrado" });
  return;
};
