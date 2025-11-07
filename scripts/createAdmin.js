// scripts/createAdmin.js
import dotenv from "dotenv";
dotenv.config();
import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const [,, username, password] = process.argv;
if(!username || !password) {
  console.log("Uso: node scripts/createAdmin.js <username> <password>");
  process.exit(1);
}

(async () => {
  try {
    const hash = await bcrypt.hash(password, 12);
    const res = await pool.query(
      "INSERT INTO users (username, password_hash, role) VALUES ($1,$2,$3) RETURNING id, username, role",
      [username, hash, "admin"]
    );
    console.log("✅ Admin creado:", res.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando admin:", err);
    process.exit(1);
  }
})();
