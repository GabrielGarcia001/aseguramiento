// src/controllers/inventoryController.js
import pool from "../config/db.js";

/**
 * Ajusta el stock (IN/OUT) y registra el movimiento de inventario de forma atómica.
 * Acepta 'movementType', 'type' o 'movement_type' en el body (tolerante).
 */
export async function adjustStock(req, res) {
  try {
    // Normalizar nombres de campo que podrían venir desde tests / frontend
    const movementTypeRaw =
      req.body.movementType ?? req.body.type ?? req.body.movement_type;
    console.log("[adjustStock] request body:", req.body);

    if (!movementTypeRaw) {
      console.log("[adjustStock] missing movementType", { body: req.body });
      return res.status(400).json({ error: "movementType (IN/OUT) requerido" });
    }

    const movementType = String(movementTypeRaw).toUpperCase();
    if (movementType !== "IN" && movementType !== "OUT") {
      return res.status(400).json({ error: "movementType debe ser 'IN' o 'OUT'" });
    }

    const { productId, quantity, note } = req.body;
    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ error: "productId y quantity requeridos" });
    }

    // Conexión y transacción
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Obtener cantidad actual
      const { rows } = await client.query(
        "SELECT quantity FROM products WHERE id = $1 FOR UPDATE",
        [productId]
      );
      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      const currentQty = Number(rows[0].quantity);

      if (movementType === "OUT") {
        if (currentQty < quantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Stock insuficiente" });
        }
        const newQty = currentQty - quantity;
        await client.query("UPDATE products SET quantity = $1 WHERE id = $2", [
          newQty,
          productId,
        ]);

        // insertar movimiento
        await client.query(
          `INSERT INTO inventory_movements (product_id, user_id, quantity, movement_type, note) VALUES ($1,$2,$3,$4,$5)`,
          [productId, req.user?.id ?? null, quantity, "OUT", note ?? null]
        );

        await client.query("COMMIT");

        // **CAMBIO**: retornamos new_quantity para compatibilidad con tests/consumidores
        return res.status(200).json({ previous: currentQty, now: newQty, new_quantity: newQty });
      } else {
        // IN
        const newQty = currentQty + quantity;
        await client.query("UPDATE products SET quantity = $1 WHERE id = $2", [
          newQty,
          productId,
        ]);

        await client.query(
          `INSERT INTO inventory_movements (product_id, user_id, quantity, movement_type, note) VALUES ($1,$2,$3,$4,$5)`,
          [productId, req.user?.id ?? null, quantity, "IN", note ?? null]
        );

        await client.query("COMMIT");

        // **CAMBIO**: retornamos new_quantity para compatibilidad con tests/consumidores
        return res.status(200).json({ previous: currentQty, now: newQty, new_quantity: newQty });
      }
    } catch (txErr) {
      await client.query("ROLLBACK");
      console.error("adjustStock transaction error:", txErr);
      return res.status(500).json({ error: "Error en la transacción" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("adjustStock top-level error:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}

// exporta otras funciones si las tienes
export async function getMovements(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventory_movements ORDER BY created_at DESC LIMIT 50"
    );
    res.json(rows);
  } catch (err) {
    console.error("getMovements error:", err);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
}
