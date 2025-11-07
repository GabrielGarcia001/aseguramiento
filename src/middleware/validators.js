import { body, validationResult } from "express-validator";

const sendValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validación fallida", details: errors.array() });
  }
  next();
};

/* Validadores para productos */
export const validateProductCreate = [
  body("name").exists().withMessage("name es obligatorio").isString().isLength({ min: 2 }),
  body("sku").exists().withMessage("sku es obligatorio").isString().isLength({ min: 1 }),
  body("quantity").optional().isInt({ min: 0 }).withMessage("quantity debe ser entero >= 0"),
  body("price").optional().isFloat({ min: 0 }).withMessage("price debe ser número >= 0"),
  body("min_stock").optional().isInt({ min: 0 }).withMessage("min_stock debe ser entero >= 0"),
  sendValidation,
];

export const validateProductUpdate = [
  // permitimos campos opcionales, pero si vienen deben ser válidos
  body("name").optional().isString().isLength({ min: 2 }),
  body("sku").optional().isString().isLength({ min: 1 }),
  body("quantity").optional().isInt({ min: 0 }),
  body("price").optional().isFloat({ min: 0 }),
  body("min_stock").optional().isInt({ min: 0 }),
  sendValidation,
];

/* Validadores para movimientos de inventario */
export const validateMovement = [
  body("productId").exists().withMessage("productId es obligatorio").isInt({ min: 1 }),
  body("quantity").exists().withMessage("quantity es obligatorio").isInt({ min: 1 }),
  body("type")
    .exists()
    .withMessage("type es obligatorio")
    .isString()
    .custom((v) => {
      const t = String(v).toUpperCase();
      return t === "IN" || t === "OUT";
    })
    .withMessage("type debe ser 'IN' o 'OUT'"),
  sendValidation,
];