// src/config/tests/inventory.test.js
import request from "supertest";
import app from "../../app.js";
import pool from "../db.js";

let adminToken;

beforeAll(async () => {
  const r = await request(app)
    .post("/auth/login")
    .send({ username: "admin1", password: "MiPassSeguro123" });
  adminToken = r.body.token;
});

describe("Inventory - IN / OUT", () => {
  let productId;

  test("Crear producto y hacer OUT/IN", async () => {
    // Crear producto
    const p = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "ProdInv",
        sku: `INV-${Date.now()}`,
        quantity: 5,
        price: 1.0,
        min_stock: 1,
      });
    expect(p.status).toBe(201);
    productId = p.body.id;

    // OUT de 2 unidades
    const out = await request(app)
      .post("/inventory")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId,
        quantity: 2,
        movementType: "OUT", // 👈 CORREGIDO
        note: "Prueba OUT",
      });
    expect(out.status).toBe(200);
    expect(out.body).toHaveProperty("previous");
    expect(out.body).toHaveProperty("now");
    expect(out.body.previous - out.body.now).toBe(2);

    // IN de 3 unidades
    const inn = await request(app)
      .post("/inventory")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId,
        quantity: 3,
        movementType: "IN", // 👈 CORREGIDO
        note: "Prueba IN",
      });
    expect(inn.status).toBe(200);
    expect(inn.body.now - out.body.now).toBe(3);
  });
});
