// src/config/tests/auth.test.js
import request from "supertest";
import app from "../../app.js"; // desde src/config/tests -> ../../app.js

describe("Auth - login", () => {
  test("Login válido (admin1) debe devolver token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "admin1", password: "MiPassSeguro123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Login inválido devuelve 401", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "noexiste", password: "x" });

    expect(res.status).toBe(401);
  });
});
