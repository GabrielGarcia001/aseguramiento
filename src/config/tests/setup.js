// src/config/tests/setup.js
import pool from "../db.js"; // desde src/config/tests -> ../db.js (la db principal) que usa TEST_DATABASE_URL si NODE_ENV=test
import bcrypt from "bcryptjs";

export default async function globalSetup() {
  // Borra tablas (ajusta nombres si son distintos)
  await pool.query("DELETE FROM inventory_movements;");
  await pool.query("DELETE FROM products;");
  await pool.query("DELETE FROM users;");

  // Inserta admin y empleado con contraseñas hasheadas
  const passAdmin = await bcrypt.hash("MiPassSeguro123", 10);
  const passEmp = await bcrypt.hash("pass1234", 10);

  await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)`,
    ["admin1", passAdmin, "admin"]
  );

  await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)`,
    ["empleado1", passEmp, "employee"]
  );
}
