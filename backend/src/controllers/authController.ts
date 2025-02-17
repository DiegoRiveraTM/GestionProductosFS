// src/controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "El usuario ya existe con ese correo" });
      return;
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(String(user._id));
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error al registrar en el servidor", error: error.message || error });
    return;
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(400).json({ message: "El correo o la contraseña son incorrectos" });
      return;
    }

    const token = generateToken(String(user._id));

    // ✅ 🔥 Devuelve el usuario dentro de `user`
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al iniciar sesión en el servidor",
      error: error.message || error,
    });
    return;
  }
};
