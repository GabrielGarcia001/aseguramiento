// src/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * authenticateToken: valida JWT y coloca payload en req.user
 * Respuestas:
 *  - 401 si falta Authorization o está mal formado
 *  - 403 si el token es inválido o expirado
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token faltante" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token malformado" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload esperado: { userId, username, role, iat, exp }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

/**
 * requireRole(...roles): middleware que exige que req.user.role esté en la lista
 * Uso: requireRole("admin") o requireRole("admin", "manager")
 */
export function requireRole(...roles) {
  const allowed = roles.flat ? roles.flat() : roles; // compatibilidad
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "No autorizado" });
    return next();
  };
}
