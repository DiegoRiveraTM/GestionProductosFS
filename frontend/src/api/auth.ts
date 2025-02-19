import axios from "axios";
import { AuthResponse, LoginData, RegisterData } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  localStorage.setItem("token", response.data.token); // 🔥 Guarda el token
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data); // 🔥 Corregí la URL
  localStorage.setItem("token", response.data.token); // 🔥 Guarda el token
  return response.data;
};
