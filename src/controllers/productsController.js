// src/controllers/productsController.js
import pool from "../config/db.js";

// Listar todos los productos
export async function getAllProducts(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, sku, quantity, price, supplier, min_stock FROM products ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("ERROR getAllProducts:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

// Obtener productos con stock menor o igual al stock mínimo
export async function getLowStock(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, sku, quantity, min_stock FROM products WHERE quantity <= min_stock ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("ERROR getLowStock:", err);
    res.status(500).json({ error: "Error al obtener productos con bajo stock" });
  }
}

// Obtener producto por id
export async function getProductById(req, res) {
  const id = req.params.id;
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("ERROR getProductById:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
}

// Crear producto
export async function createProduct(req, res) {
  const { name, sku, quantity = 0, price = 0, supplier = null, min_stock = 0 } = req.body;
  if (!name || !sku) return res.status(400).json({ error: "name y sku son requeridos" });
  try {
    const q = `INSERT INTO products (name, sku, quantity, price, supplier, min_stock)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, sku, quantity, price, supplier, min_stock`;
    const values = [name, sku, quantity, price, supplier, min_stock];
    const { rows } = await pool.query(q, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("ERROR createProduct:", err);
    if (err.code === "23505") return res.status(409).json({ error: "SKU ya existe" });
    res.status(500).json({ error: "Error al crear producto" });
  }
}

// Actualizar producto
export async function updateProduct(req, res) {
  const id = req.params.id;
  const { name, sku, quantity, price, supplier, min_stock } = req.body;

  try {
    // 1) Obtener producto actual
    const { rows: existingRows } = await pool.query(
      "SELECT id, name, sku, quantity, price, supplier, min_stock FROM products WHERE id = $1",
      [id]
    );
    if (existingRows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

    const existing = existingRows[0];

    // 2) Decidir valores finales: si viene en body, usarlo; si no, mantener existente
    const finalName = name !== undefined ? name : existing.name;
    const finalSku = sku !== undefined ? sku : existing.sku;
    const finalQuantity = quantity !== undefined ? quantity : existing.quantity;
    const finalPrice = price !== undefined ? price : existing.price;
    const finalSupplier = supplier !== undefined ? supplier : existing.supplier;
    const finalMinStock = min_stock !== undefined ? min_stock : existing.min_stock;

    // 3) Validaciones simples
    if (!finalName || !finalSku) {
      return res.status(400).json({ error: "name y sku no pueden quedar vacíos" });
    }
    if (finalQuantity < 0) return res.status(400).json({ error: "quantity no puede ser negativo" });
    if (finalPrice < 0) return res.status(400).json({ error: "price no puede ser negativo" });

    // 4) Ejecutar UPDATE
    const q = `UPDATE products
               SET name=$1, sku=$2, quantity=$3, price=$4, supplier=$5, min_stock=$6, updated_at=now()
               WHERE id=$7
               RETURNING id, name, sku, quantity, price, supplier, min_stock`;
    const values = [finalName, finalSku, finalQuantity, finalPrice, finalSupplier, finalMinStock, id];

    const { rows } = await pool.query(q, values);
    res.json(rows[0]);
  } catch (err) {
    console.error("ERROR updateProduct:", err);
    // Detectar violación de unique (SKU duplicado)
    if (err.code === "23505") return res.status(409).json({ error: "SKU ya existe" });
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

// Eliminar producto
export async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const { rowCount } = await pool.query("DELETE FROM products WHERE id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("ERROR deleteProduct:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}
