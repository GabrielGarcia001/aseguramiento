// backend/src/config/tests/roles_permissions.test.js
import request from "supertest";
import app from "../../app.js";
import { resetDB, seedBasicData } from "./test-utils.js";

let adminToken;
let empToken;
let seeded;

beforeAll(async () => {
  // se asume jest.setup.js ya cargó .env.test y el pool
});

beforeEach(async () => {
  // limpiar y sembrar datos básicos antes de cada test
  await resetDB();
  seeded = await seedBasicData();

  // login admin
  const r1 = await request(app)
    .post("/auth/login")
    .send({ username: "admin1", password: "MiPassSeguro123" });
  adminToken = r1.body.token;

  // login empleado
  const r2 = await request(app)
    .post("/auth/login")
    .send({ username: "empleado1", password: "pass1234" });
  empToken = r2.body.token;
});

afterAll(async () => {
  // jest.setup.js cierra pool; aquí no es necesario cerrar otra vez
});

describe("Roles y permisos - casos críticos", () => {
  test("Admin puede crear producto (201)", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "NuevoProd", sku: `NP-${Date.now()}`, quantity: 10, price: 2.5 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("Empleado NO puede crear producto (403)", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${empToken}`)
      .send({ name: "ProdEmp", sku: `PE-${Date.now()}`, quantity: 2, price: 1.0 });
    expect(res.status).toBe(403);
  });

  test("Admin puede eliminar producto (204/200 según implementación)", async () => {
    // crea producto por admin
    const create = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ParaEliminar", sku: `DEL-${Date.now()}`, quantity: 5, price: 3.0 });
    expect(create.status).toBe(201);
    const id = create.body.id;

    // eliminar como admin
    const del = await request(app)
      .delete(`/products/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    // Aceptamos 200 o 204 según tu implementación:
    expect([200, 204]).toContain(del.status);
  });

  test("Empleado NO puede eliminar producto (403)", async () => {
    // crea producto con admin
    const create = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ParaEliminar2", sku: `DEL2-${Date.now()}`, quantity: 5, price: 3.0 });
    expect(create.status).toBe(201);
    const id = create.body.id;

    // intenta eliminar como empleado
    const del = await request(app)
      .delete(`/products/${id}`)
      .set("Authorization", `Bearer ${empToken}`);
    expect(del.status).toBe(403);
  });

  test("Sin token -> 401 al crear producto", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Nada", sku: `N-${Date.now()}`, quantity: 1, price: 1.0 });
    expect(res.status).toBe(401);
  });

  test("Empleado puede registrar salida (OUT) si está permitido", async () => {
    // usar el product seed de seedBasicData
    const productId = seeded.product.id;

    // registro OUT por empleado (si tu endpoint es /inventory o /inventory/movements)
    // Adapta el endpoint y el body según tu implementación real:
    const out = await request(app)
      .post("/inventory")
      .set("Authorization", `Bearer ${empToken}`)
      .send({ productId, quantity: 2, type: "OUT", note: "Venta prueba" });

    // Aceptamos 200 o 201 según tu implementación
    expect([200, 201]).toContain(out.status);
  });
});
