// src/config/tests/inventory_extra.test.js
import request from "supertest";
import pool from '../config/db.js';
import app from '../app.js';

let adminToken;

beforeAll(async () => {
  // login admin (ajusta username/password si tus credenciales difieren)
  const res = await request(app).post("/auth/login").send({ username: "admin1", password: "MiPassSeguro123" });
  adminToken = res.body.token;
});

afterAll(async () => {
});

test("OUT debe fallar si stock insuficiente", async () => {
  // crea producto con qty 1
  const p = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "PruebaStock", sku: `PS-${Date.now()}`, quantity: 1, price: 1.0 });

  expect(p.status).toBe(201);
  const productId = p.body.id;

  // intenta OUT 2 unidades -> debe ser 400 o error definido
  const out = await request(app)
    .post("/inventory")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ productId, quantity: 2, movementType: "OUT", note: "Prueba" });

  expect(out.status).toBeGreaterThanOrEqual(400);
  expect(out.status).toBeLessThan(500);
});

test("IN aumenta stock", async () => {
  const p = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "PruebaStockIN", sku: `PSIN-${Date.now()}`, quantity: 0, price: 1.0 });

  expect(p.status).toBe(201);
  const productId = p.body.id;

  const resIn = await request(app)
    .post("/inventory")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ productId, quantity: 5, movementType: "IN", note: "Ingreso prueba" });

  expect(resIn.status).toBe(200);
  expect(resIn.body).toHaveProperty("new_quantity");
  expect(resIn.body.new_quantity).toBeGreaterThanOrEqual(5);
});
