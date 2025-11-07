# Sistema de Inventario - Backend

## Requisitos
- Node.js (v16+ recommended)
- PostgreSQL
- npm

## Instalación
1. Copiar `.env.example` -> `.env` y rellenar credenciales.
2. Copiar `.env.test.example` -> `.env.test` para entorno de pruebas (DB test).
3. Instalar dependencias:
npm install
4. Crear DB y tablas (si no existen). Ejecutar script SQL en `db/schema.sql` (o usar pgAdmin).

## Comandos útiles
- Levantar servidor: `npm run dev`
- Ejecutar tests: `npm test`
- Ejecutar coverage: `npm run test:coverage`

## Notas
- Test DB configurada en `.env.test`. Tests cierran la pool automáticamente usando `jest.setup.js`.
