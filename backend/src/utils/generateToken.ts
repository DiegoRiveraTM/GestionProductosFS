import jwt from "jsonwebtoken";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Expira en 30 días
  });
};

export default generateToken;
