@echo off
cd /d %~dp0

echo Ejecutando tests completos y guardando output...
npx cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand --verbose > all-tests-output.txt 2>&1

echo Ejecutando coverage y guardando output...
npx cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage --runInBand --verbose > coverage-output.txt 2>&1

echo Abriendo coverage HTML (si existe)...
if exist coverage\lcov-report\index.html (
  start coverage\lcov-report\index.html
) else (
  echo Coverage HTML no encontrado.
)

echo Hecho. Archivos generados:
echo  - all-tests-output.txt
echo  - coverage-output.txt
pause
