// backend/scripts/seed_products.js
import pool from "../src/config/db.js";

function randomPrice() {
  return Number((Math.random() * 100).toFixed(2));
}
function randomQuantity() {
  return Math.floor(Math.random() * 500);
}

async function seedProducts() {
  try {
    console.log("🌱 Insertando 1000 productos de prueba...");

    for (let i = 1; i <= 1000; i++) {
      const name = `Producto ${i}`;
      const sku = `SKU-${String(i).padStart(4, "0")}-${Date.now().toString().slice(-4)}`;
      const price = randomPrice();
      const quantity = randomQuantity();
      const min_stock = Math.floor(Math.random() * 5); // 0..4

      // Insert usando solo columnas que casi seguro existen en tu tabla
      await pool.query(
        `INSERT INTO products (name, sku, price, quantity, min_stock)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, sku, price, quantity, min_stock]
      );

      if (i % 100 === 0) console.log(`  -> ${i} productos insertados`);
    }

    console.log("✅ Inserción completada correctamente.");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al insertar productos:", err);
    try { await pool.end(); } catch(e) {}
    process.exit(1);
  }
}

seedProducts();
