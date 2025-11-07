// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Register (crea usuario con role 'employee' por defecto)
router.post(
  "/register",
  body("username").isLength({ min: 3 }),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    try {
      const hash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        "INSERT INTO users (username, password_hash, role) VALUES ($1,$2,$3) RETURNING id, username, role",
        [username, hash, "employee"]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === "23505") return res.status(409).json({ error: "Usuario ya existe" });
      console.error("auth/register error:", err);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  }
);

// Login (devuelve JWT)
router.post(
  "/login",
  body("username").exists(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    try {
      const r = await pool.query("SELECT id, username, password_hash, role FROM users WHERE username=$1", [username]);
      if (r.rowCount === 0) return res.status(401).json({ error: "Credenciales inválidas" });
      const user = r.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      res.json({ token });
    } catch (err) {
      console.error("auth/login error:", err);
      res.status(500).json({ error: "Error en login" });
    }
  }
);

export default router;
