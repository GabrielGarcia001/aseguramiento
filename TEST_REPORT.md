# Informe de Pruebas

## Resumen ejecutivo
- Fecha de ejecución: [fecha]
- Entorno: .env.test (Postgres DB de prueba)
- Resultados: [x] tests pasados, [y] fallidos.

## Comandos ejecutados
- `npx cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand`
- `npx cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage --runInBand`

## Resultados clave (adjuntar fragmentos)
- Tests summary (copia de `all-tests-output.txt` relevante).
- Coverage summary (copiar tabla resumen de `coverage-output.txt` o screenshot de `coverage/lcov-report/index.html`).

## Evidencias (archivos adjuntos)
- all-tests-output.txt
- coverage-output.txt
- coverage/lcov-report/index.html (screenshot)
- curl-create-product.json (ejemplo request/response)

## Observaciones y acciones tomadas
- Implementadas transacciones en `inventoryController` para evitar race conditions.
- Tests agregados: inventory_out_insufficient, inventory_in.