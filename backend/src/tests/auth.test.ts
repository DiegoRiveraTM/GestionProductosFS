import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import User from "../models/User";

describe("🔐 Auth API Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
    await User.deleteMany({}); // 🔥 Limpia la base antes de iniciar pruebas
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("🔹 Debería registrar un usuario", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token"); // ✅ Asegurar estructura de respuesta
    expect(res.body.email).toBe("testuser@example.com");
  });

  it("🔹 No debería registrar un usuario duplicado", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("El usuario ya existe con ese correo");
  });

  it("🔹 Debería iniciar sesión correctamente", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("🔹 No debería iniciar sesión con credenciales incorrectas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("El correo o la contraseña son incorrectos");
  });
});
