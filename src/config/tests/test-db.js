// src/test-db.js
import pool from "../config/db.js";

//(async () => {
afterAll(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión OK. Hora DB:", res.rows[0].now);
    //await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error de conexión a PostgreSQL:", err.message);
    process.exit(1);
  }
})();
