# Inicio rápido — App nueva desde Adelante App Starter

Para crear una app interna nueva del grupo en 7 pasos.

---

1. **En GitHub:** click **"Use this template"** → **"Create a new repository"**.
2. **Nombre del repo:** `adelante-<nombre-app>` (kebab-case). Ejemplo: `adelante-cobranza`.
3. **Clonar local:**
   ```bash
   git clone https://github.com/<org>/adelante-<app>.git
   cd adelante-<app>
   ```
4. **Instalar dependencias:**
   ```bash
   npm install
   ```
5. **El primer `npm install` configura todo automáticamente:**
   - Copia `web/.env.example` → `web/.env.local` (modo dev activo por default)
   - Copia `api/local.settings.example.json` → `api/local.settings.json`
   - Buildea `@adelante/shared` para que las apps puedan resolverlo

   El starter arranca con un usuario dummy (`Dev User`) y skipea MSAL + validación JWT.
   Si más adelante necesitás configurar Azure real, editá esos archivos manualmente.
6. **Arrancar:**
   ```bash
   npm run dev
   ```
   - Web: http://localhost:5173
   - API: http://localhost:7071
7. **Verificar:** abrir http://localhost:5173 — debería ver la **pantalla de ejemplo** con 2 KPIs (Total de items = 3, Monto total = ₡2,695,500.50) y una tabla con 3 filas.

---

## Primer cambio

Editá `web/src/pages/EjemploPantalla.tsx` para empezar a construir tu app, o creá pantallas nuevas en `web/src/pages/` siguiendo la convención `<Nombre>Pantalla.tsx`.

Para endpoints: agregar archivos en `api/src/functions/` siguiendo el patrón de `ejemplo.ts` (`app.http('nombre', { ... })`) e importarlos en `api/src/index.ts`.

Para tipos compartidos entre frontend y backend: agregarlos en `shared/src/tipos/` y exportarlos desde el barrel `shared/src/index.ts`.

---

## Si algo no arranca

Mirá la sección **Troubleshooting** del [`README.md`](./README.md). Los problemas más comunes:

- Falta de build inicial de `shared` → corré `npm run build --workspace=@adelante/shared`.
- Puerto `7071` o `5173` ocupado → cerrá pestañas/procesos de otras apps Adelante locales.
- Warnings de `AzureWebJobsStorage` en consola → esperado en dev local, ignorar.

---

Documentación completa: [`README.md`](./README.md) · Decisiones arquitectónicas: [`contexto_arquitectura.md`](./contexto_arquitectura.md).
