export default function errorHandler(err, req, res, next) {
  console.error("ERROR GLOBAL:", err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}