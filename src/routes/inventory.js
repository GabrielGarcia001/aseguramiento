import express from "express";
import { adjustStock, getMovements } from "../controllers/inventoryController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, adjustStock);
router.get("/movements", authenticateToken, getMovements);

export default router;
