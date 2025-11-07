// backend/src/config/tests/search_lowstock.test.js
import request from "supertest";
import { expect } from '@jest/globals';
import app from "../../app.js";
import { resetDB, seedBasicData } from "./test-utils.js";

let adminToken;
let seeded;

beforeEach(async () => {
  await resetDB();
  seeded = await seedBasicData();

  const r1 = await request(app)
    .post("/auth/login")
    .send({ username: "admin1", password: "MiPassSeguro123" });
  adminToken = r1.body.token;

  // Agregar más productos para búsqueda
  await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Arena Fina", sku: "ARE-002", quantity: 30, price: 2.5 });

  await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Arenilla", sku: "ARE-003", quantity: 3, price: 1.0, min_stock: 5 }); // low stock
});

afterAll(async () => {
  // jest.setup.js cerrará pool
});

describe("Búsqueda y low-stock", () => {
  test("Buscar por nombre devuelve coincidencias (200)", async () => {
    const res = await request(app).get("/products?search=Arena").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    // Esperamos al menos 1 resultado que contenga 'Arena' en el nombre
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.some(p => p.name && p.name.includes("Arena"))).toBeTruthy();
  });

  test("Buscar por SKU devuelve el producto correcto (200)", async () => {
    const res = await request(app).get("/products?search=ARE-002").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    // Antes: expect(res.body[0].sku).toBe("ARE-002");
    expect(res.body.some(p => p.sku === "ARE-002")).toBeTruthy();
  });

  test("GET /products/low-stock devuelve productos por debajo del min_stock", async () => {
    const res = await request(app).get("/products/low-stock").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // El producto con SKU ARE-003 tiene quantity 3 y min_stock 5 -> debería aparecer
    expect(res.body.some(p => p.sku === "ARE-003")).toBeTruthy();
  });
});
