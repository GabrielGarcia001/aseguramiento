/* Antiguo src/routes/products.js
import express from "express";
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router; */ 

//Actualizado
// src/routes/products.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock
} from "../controllers/productsController.js";

import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validateProductCreate, validateProductUpdate } from "../middleware/validators.js";

const router = express.Router();

router.get("/", authenticateToken, getAllProducts);
router.get("/low-stock", authenticateToken, getLowStock);
router.get("/:id", authenticateToken, getProductById);

// Protegidas por rol admin
router.post("/", authenticateToken, requireRole("admin"), validateProductCreate, createProduct);
router.put("/:id", authenticateToken, requireRole("admin"), validateProductUpdate, updateProduct);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteProduct);

export default router;