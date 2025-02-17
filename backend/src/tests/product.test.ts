import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import User from "../models/User";
import Product from "../models/Product";
import generateToken from "../utils/generateToken";

describe("🛒 Product API Tests", () => {
  let token: string = "";

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
    await User.deleteMany({});
    await Product.deleteMany({}); // 🔥 Asegurar entorno limpio

    const user = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "123456",
    }) as any;

    token = generateToken(String(user._id));
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  it("📌 Debería crear un producto", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Laptop Gamer",
        price: 1500,
        description: "Laptop con RTX 4060",
        stock: 10
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name", "Laptop Gamer");
    expect(res.body).toHaveProperty("price", 1500);
  });

  it("📌 Debería obtener todos los productos", async () => {
    const res = await request(app).get("/api/products").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
