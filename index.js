
/* Rutas antiguas
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import productsRouter from "./src/routes/products.js";

const app = express();
app.use(express.json());


app.get("/", (req, res) => res.send("API funcionando 🚀"));
app.use("/products", productsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */

// index.js
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});