# SQAP — Plan de Aseguramiento de la Calidad
Proyecto: Sistema de Gestión de Inventario para Pyme  
Autor: Gabriel Alejandro García Montúfar  
Fecha: [colocar fecha]

## 1. Objetivos de calidad
- Asegurar disponibilidad, integridad y exactitud del inventario.
- Mantener cobertura de pruebas > 80%.
- Evitar condiciones de carrera en operaciones de inventario.

## 2. Alcance
- Backend (Node.js + Express + PostgreSQL). Incluye autenticación, CRUD productos, movimientos.

## 3. Estrategia de pruebas
- Unit tests: Jest (controladores, middlewares). Frecuencia: en cada cambio.
- Integration tests: Supertest contra servidor con DB de prueba (.env.test).
- Performance: autocannon para endpoints críticos (productos, movimientos).
- Security: chequeo manual de inyección SQL, uso de parámetros preparados.

## 4. Criterios de aceptación
- Todos los tests unitarios e integración deben pasar.
- Cobertura: >= 80% en líneas críticas (controllers, middlewares).
- Transacciones implementadas en endpoints que actualizan stock.

## 5. Herramientas
- Node.js, Jest, Supertest, Postgres, npm, autocannon, helmet, express-validator.

## 6. Cronograma y responsables
- [detallar: hoy — completar transacciones/tests/documentación]

## 7. Entregables de calidad
- Resultados de tests (archivos .txt)
- Reporte de coverage (HTML)
- Registro de pruebas de rendimiento
