// backend/src/config/tests/test-utils.js
import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

/**
 * resetDB: elimina datos de tablas que usamos en tests y reinicia identidades.
 * Ajusta nombres de tablas si tus tablas tienen nombres distintos.
 */
export async function resetDB() {
  // Orden: child tables primero (inventory_movements), luego products, users
  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE inventory_movements RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE;");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}

/**
 * seedBasicData: inserta admin y empleado y un producto básico.
 * Devuelve los objetos insertados (id, username, role).
 */
export async function seedBasicData() {
  const passAdminHash = await bcrypt.hash("MiPassSeguro123", 10);
  const passEmpHash = await bcrypt.hash("pass1234", 10);

  // Inserta usuarios
  const u1 = await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role`,
    ["admin1", passAdminHash, "admin"]
  );

  const u2 = await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role`,
    ["empleado1", passEmpHash, "employee"]
  );

  // Inserta producto base
  const p = await pool.query(
    `INSERT INTO products (name, sku, quantity, price, min_stock) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, sku`,
    ["ProductoBase", `PB-${Date.now()}`, 50, 5.00, 5]
  );

  return {
    users: [u1.rows[0], u2.rows[0]],
    product: p.rows[0]
  };
}
