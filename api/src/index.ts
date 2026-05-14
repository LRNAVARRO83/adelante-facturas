/**
 * Punto de entrada del worker de Azure Functions v4.
 *
 * El runtime carga este archivo (apuntado por `main` en package.json) y los
 * imports registran cada Function vía `app.http(...)` / `app.timer(...)` / etc.
 *
 * Para agregar una nueva function: crear el archivo en `src/functions/` con
 * su `app.http(...)` y añadir el import acá.
 */

import './functions/ejemplo.js';
