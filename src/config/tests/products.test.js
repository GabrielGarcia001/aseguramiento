// src/config/tests/products.test.js
import request from "supertest";
import app from "../../app.js";

let adminToken;
let empToken;

beforeAll(async () => {
  // Login admin y empleado (ya sembrados por setup)
  const r1 = await request(app).post("/auth/login").send({ username: "admin1", password: "MiPassSeguro123" });
  adminToken = r1.body.token;

  const r2 = await request(app).post("/auth/login").send({ username: "empleado1", password: "pass1234" });
  empToken = r2.body.token;
});

describe("Products - CRUD y permisos", () => {
  test("GET /products (admin) debe devolver array", async () => {
    const res = await request(app).get("/products").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /products (empleado) debe 403", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${empToken}`)
      .send({ name: "PruebaEmp", sku: `EMP-${Date.now()}`, quantity: 1, price: 1.0 });
    expect(res.status).toBe(403);
  });

  test("POST /products (admin) debe 201 y devolver id", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "PruebaAdmin", sku: `PA-${Date.now()}`, quantity: 10, price: 2.0 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
