// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// rutas
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import inventoryRouter from "./routes/inventory.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// rutas base
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/inventory", inventoryRouter);

// manejador de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

export default app;
