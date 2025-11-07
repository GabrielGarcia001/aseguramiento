// jest.setup.js (en la raíz del proyecto)
afterAll(async () => {
  try {
    // import dinámico para compatibilidad ESM con Jest
    const { default: pool } = await import('./src/config/db.js');

    // guardamos bandera global para evitar doble cierre
    if (!global.__PG_POOL_CLOSED) {
      console.log("Cerrando conexión a la base de datos (jest.setup.js)...");
      await pool.end();
      global.__PG_POOL_CLOSED = true;
    } else {
      console.log("Pool ya cerrado (jest.setup.js) - omitiendo close.");
    }
  } catch (err) {
    console.error("Error cerrando la base de datos en jest.setup.js:", err);
  }
});
