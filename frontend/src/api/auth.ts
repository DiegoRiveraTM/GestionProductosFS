import axios from "axios";
import { AuthResponse, LoginData, RegisterData } from "../types/auth";

const API_URL = "https://gestionproductosfs.onrender.com/api";

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  localStorage.setItem("token", response.data.token); // 🔥 Guarda el token
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  localStorage.setItem("token", response.data.token); // 🔥 Guarda el token
  return response.data;
};
