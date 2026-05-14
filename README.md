# Adelante App Starter

> Template oficial de aplicaciones internas del **Grupo Adelante**.
> Monorepo TypeScript con frontend Vite + React, backend Azure Functions y tipos compartidos. Listo para clonar y empezar.

---

## ¿Qué es?

Un molde de aplicación, no una aplicación específica. Materializa todas las decisiones técnicas del grupo (stack, paleta, auth, naming, layout) para que crear una nueva app interna se reduzca a clonar este repo y empezar a escribir lógica de negocio.

Incluye un ejemplo end-to-end mínimo (endpoint `GET /api/ejemplo` + pantalla con KPI y tabla) para demostrar el patrón canónico que debe seguir cualquier feature nueva.

**Fuente de verdad arquitectónica:** [`contexto_arquitectura.md`](./contexto_arquitectura.md). Toda decisión documentada ahí prevalece sobre lo que esté en este README.

---

## Stack tecnológico

| Workspace | Stack |
|---|---|
| **`shared/`** | TypeScript puro, Zod, sin deps de runtime externas |
| **`api/`** | Azure Functions v4, `@azure/identity`, `mssql`, `jose`, `zod` |
| **`web/`** | React 18, Vite, Tailwind, shadcn/ui (style "new-york"), TanStack Query, MSAL, React Router v6, Sonner |

Versiones lockstep (ver `package.json` de cada workspace para lo exacto):

| Categoría | Paquetes |
|---|---|
| Runtime | Node `>=20`, npm `>=10` |
| Lenguaje | TypeScript `^5.7` |
| Frontend | React `^18.3.1`, Vite `^5.4.10`, Tailwind `^3.4.14`, `@tanstack/react-query ^5.59`, `@azure/msal-browser ^5.10`, `react-router-dom ^6.27`, `sonner ^1.7`, `lucide-react ^0.456` |
| Backend | `@azure/functions ^4.5`, `@azure/identity ^4.5`, `mssql ^11.0.1`, `zod ^3.23.8`, `jose ^6.2.3` |
| Tooling | Biome `^1.9` (lint + format), Concurrently `^9.1`, Rimraf `^6.0` |

Detalle completo y motivación de cada elección: [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 3.

---

## Crear una app nueva desde este template

Para arranque exprés, mirá [`INICIO_RAPIDO.md`](./INICIO_RAPIDO.md). Resumen:

1. En GitHub, click **"Use this template"** → **"Create a new repository"**.
2. Nombre del repo: `adelante-<nombre-app>` (kebab-case).
3. Clonar local: `git clone https://github.com/<org>/adelante-<app>.git`.
4. `cd adelante-<app> && npm install`.
5. Configurar `web/.env.local` (copiando de `web/.env.example`) y `api/local.settings.json` (copiando de `api/local.settings.example.json`). Para arrancar sin Azure configurado, dejar `VITE_AUTH_DEV_MODE=true` y `AUTH_DEV_MODE=true`.
6. `npm run dev` desde la raíz → web en `localhost:5173`, api en `localhost:7071`.
7. Empezar a editar `web/src/pages/` y `api/src/functions/` para tu app.

---

## Estructura del proyecto

```
adelante-app-starter/
├── package.json              # workspace root, scripts globales
├── tsconfig.base.json        # TS config compartido
├── biome.json                # config de lint + format
├── shared/                   # @adelante/shared
│   └── src/
│       ├── tipos/            # tipos TS (Ejemplo, RespuestaApi)
│       ├── schemas/          # schemas Zod
│       └── utilidades/       # formatearMonto, formatearFecha
├── api/                      # @adelante/api (Azure Functions)
│   ├── host.json
│   ├── local.settings.example.json
│   └── src/
│       ├── auth/             # middleware JWT + modo dev
│       ├── db/               # pool mssql con Managed Identity
│       ├── lib/              # helpers de respuesta
│       └── functions/        # endpoints HTTP
├── web/                      # @adelante/web (Vite + React)
│   ├── index.html
│   ├── tailwind.config.ts
│   └── src/
│       ├── components/
│       │   ├── ui/           # shadcn/ui (no editar manualmente)
│       │   ├── dominio/      # MontoCRC, MontoUSD, FechaCR, EstadoBadge
│       │   └── layout/       # HeaderAdelante, LayoutPrincipal, LogoAdelante
│       ├── hooks/
│       ├── lib/              # auth.ts, cliente.ts, utils.ts (cn)
│       ├── pages/            # *Pantalla.tsx
│       ├── router/           # routes.tsx
│       ├── App.tsx
│       └── main.tsx
└── .github/workflows/        # ci, deploy-web, deploy-api
```

Detalle por carpeta: [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 3.1.

---

## Levantar el dev environment

Desde la raíz del monorepo:

```bash
npm install          # instala todo el monorepo (single lockfile)
npm run dev          # api en :7071 + web en :5173 (concurrente)
```

Scripts disponibles en la raíz:

| Comando | Acción |
|---|---|
| `npm run dev` | Arranca api + web en paralelo |
| `npm run build` | Build de los 3 workspaces en orden (shared → api → web) |
| `npm run typecheck` | `tsc --noEmit` en todos los workspaces |
| `npm run lint` | Biome check |
| `npm run lint:fix` | Biome check con autofix |
| `npm run format` | Biome format con autofix |
| `npm run clean` | Borra node_modules y dist en todo el monorepo |

Puertos por convención (matchean el contexto):

| Servicio | Puerto |
|---|---|
| Vite (web) | `5173` |
| Azure Functions (api) | `7071` |

---

## Variables de entorno

### Frontend — `web/.env.local`

Plantilla en `web/.env.example`. **No se commitea**.

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend. En dev: `http://localhost:7071`. En prod: la del Function App. |
| `VITE_AZURE_CLIENT_ID` | Client ID del App Registration de Entra ID (frontend SPA). |
| `VITE_AZURE_TENANT_ID` | Tenant ID del Grupo Adelante. |
| `VITE_AZURE_API_SCOPE` | Scope expuesto por la API. Formato: `api://<api-client-id>/access_as_user`. |
| `VITE_AUTH_DEV_MODE` | `true` para skipear MSAL en dev local. Cambiar a `false` o quitar antes de buildear para producción. |

### Backend — `api/local.settings.json`

Plantilla en `api/local.settings.example.json`. **No se commitea** (ya está en `.gitignore`).

| Variable | Descripción |
|---|---|
| `FUNCTIONS_WORKER_RUNTIME` | Siempre `node`. |
| `AzureWebJobsFeatureFlags` | Siempre `EnableWorkerIndexing` (requerido por Functions v4 programming model). |
| `NODE_ENV` | `development` en local, `production` en Azure. |
| `AUTH_DEV_MODE` | `true` para skipear validación JWT en local. **Nunca true en producción.** |
| `AZURE_TENANT_ID` | Tenant Adelante. |
| `AZURE_CLIENT_ID` | Client ID del App Registration de la API. |
| `AZURE_API_AUDIENCE` | Audience esperada en el JWT (igual al scope sin prefijo). |
| `SQL_SERVER` | Servidor SQL. Default: `mysqladelante.database.windows.net`. |
| `SQL_DATABASE` | Nombre de la base de datos de la app. |

En producción estas variables viven en **Application Settings** del Function App con Managed Identity, no en `local.settings.json`. Ver [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 6.2.

---

## Convenciones de naming

Resumen rápido:

- **Español** para todo identificador de dominio: tipos (`Factura`), variables (`montoTotal`), funciones (`calcularTotal()`), componentes (`<DashboardPantalla />`), tablas SQL (`facturas`), endpoints (`/api/facturas`).
- **Inglés** solo para palabras reservadas de framework: hooks (`useFacturas`), eventos React (`onClick`), tipos genéricos (`T`, `K`, `V`).

Convenciones de archivos:

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Pantalla | `PascalCase + Pantalla.tsx` | `DashboardPantalla.tsx` |
| Panel | `PascalCase + Panel.tsx` | `PanelProveedor.tsx` |
| Modal | `Modal + PascalCase.tsx` | `ModalNuevoMovimiento.tsx` |
| Hook | `use + camelCase.ts` | `useFacturas.ts` |
| Function | `camelCase.ts` (sustantivo plural) | `facturas.ts` |
| Utilidad | `camelCase.ts` (verbo) | `formatearMonto.ts` |
| shadcn/ui | `kebab-case.tsx` (no editar) | `button.tsx` |

Tabla completa: [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 5.

---

## Componentes de dominio disponibles

Viven en `web/src/components/dominio/`. Usar siempre estos en vez de formatear a mano.

```tsx
import { MontoCRC, MontoUSD, FechaCR, EstadoBadge } from '@/components/dominio';

<MontoCRC monto={1500000} />          // ₡1,500,000.00 (font-mono, tabular-nums)
<MontoUSD monto={1234.56} />          // $1,234.56
<FechaCR fecha={new Date()} />        // 13/05/2026 (default formato 'corto')
<FechaCR fecha="2026-05-13" formato="largo" />  // 13 de mayo de 2026
<EstadoBadge estado="procesado" />    // Badge verde Adelante suave
<EstadoBadge estado="pendiente" />    // Badge gris
<EstadoBadge estado="error" />        // Badge rojo
<EstadoBadge estado="revisar" />      // Badge amarillo
```

Formato monetario oficial: `₡2,695,500.50` y `$1,234.56` (locale `en-US`, símbolo manual). La razón es consistencia con Business Central, Hacienda, facturas electrónicas, bancos y estados de cuenta del grupo. Implementación centralizada en `shared/src/utilidades/formatearMonto.ts`.

---

## Cómo agregar nuevos componentes shadcn/ui

`web/components.json` ya está configurado (style "new-york", baseColor "zinc", aliases `@/components` y `@/lib/utils`). Para sumar un componente nuevo:

```bash
cd web
npx shadcn@latest add <componente>
```

Por ejemplo `npx shadcn@latest add calendar popover command`. El CLI copia el código en `web/src/components/ui/` y agrega los peers de Radix UI que correspondan.

**Importante:** los archivos de `web/src/components/ui/` están en el `ignore` de Biome. No los edites manualmente — si necesitás un comportamiento custom, envolvelos en un componente nuevo (típicamente en `components/dominio/`).

---

## CI/CD

Tres workflows en `.github/workflows/`:

| Workflow | Trigger | Qué hace |
|---|---|---|
| `ci.yml` | push (cualquier branch) + PR a `main` | typecheck + lint + build de los 3 workspaces |
| `deploy-web.yml` | push a `main` + manual | Build y deploy a Azure Static Web Apps |
| `deploy-api.yml` | push a `main` (paths `api/**` o `shared/**`) + manual | Build y deploy a Azure Functions |

Secrets y variables que deben configurarse en GitHub (**Settings → Secrets and variables → Actions**) para que los deploys funcionen:

| Workflow | Tipo | Nombre | Cómo obtenerlo |
|---|---|---|---|
| `deploy-web` | secret | `AZURE_STATIC_WEB_APPS_API_TOKEN` | Portal Azure → Static Web App → Manage deployment token |
| `deploy-api` | variable | `AZURE_FUNCTIONAPP_NAME` | Nombre del Function App creado en Azure |
| `deploy-api` | secret | `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Portal Azure → Function App → Get publish profile (XML completo) |

El `ci.yml` no requiere secrets y corre apenas se conecta el repo.

Detalle de la estrategia CI/CD: [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 7.2.

---

## Modo dev vs modo producción (autenticación)

El starter soporta dos modos de autenticación:

### Modo dev (sin Azure configurado)

Para que cualquier persona pueda clonar el repo y arrancar sin tener que crear App Registrations en Entra ID:

1. `web/.env.local` con `VITE_AUTH_DEV_MODE=true`
2. `api/local.settings.json` con `AUTH_DEV_MODE=true` y `NODE_ENV=development`

En este modo:

- El frontend **no instancia MSAL**. Se usa un usuario hardcodeado (`Dev User <dev@adelante.cr>`).
- El backend **no valida JWT**. Acepta requests sin header `Authorization`.

### Modo producción (MSAL real)

- Quitar `VITE_AUTH_DEV_MODE` (o ponerlo `false`).
- Configurar `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`, `VITE_AZURE_API_SCOPE`.
- En Azure: `NODE_ENV=production` (defensa en profundidad — aunque alguien deje `AUTH_DEV_MODE=true` por error, el `NODE_ENV` corta la posibilidad).

**Nunca usar modo dev en producción.** El código está blindado con doble condición (`NODE_ENV !== 'production'` Y `AUTH_DEV_MODE === 'true'`) en backend, y `import.meta.env.DEV` en frontend.

Detalle: [`contexto_arquitectura.md`](./contexto_arquitectura.md) § 6.1.

---

## Troubleshooting

### Vulnerability `esbuild` moderate

`npm audit` reporta una vulnerabilidad moderate en `esbuild` (transitiva via Vite 5). Solo afecta el dev server (no producción), y el fix requiere Vite 8 que rompe el lockstep del contexto. **Sin acción**, esperamos a la próxima ola de actualización coordinada.

### Warning `AzureWebJobsStorage` unhealthy en local

Al arrancar `func start` aparece:

```
Process reporting unhealthy: "azure.functions.webjobs.storage": "Unable to create client for AzureWebJobsStorage"
```

Es **esperado** en dev local porque no configuramos Azure Storage (no se necesita para HTTP triggers solos). En producción, las Application Settings del Function App incluyen `AzureWebJobsStorage` automáticamente.

### Errores `<other>` en DevTools Console

Si ves errores agrupados como `<other>` en el Console del navegador (Edge/Chrome), provienen de **extensiones del navegador**, no del código de la app. Verifica que ningún archivo de tu proyecto aparece en la lista de fuentes de los errores.

### `func start` cae con exit code `4294967295`

Visto al correr varias apps Adelante en paralelo en el mismo `localhost:7071`: cuando una app del navegador hace polling a endpoints inexistentes y `AzureWebJobsStorage` está vacío, el host de Functions termina cayéndose. Solución: cerrar pestañas de otras apps que apunten al mismo puerto antes de arrancar.

### `npm run dev` no encuentra `@adelante/shared`

`shared/` debe estar **buildeado** antes que api/web lo importen en runtime (los workspaces resuelven vía `package.json exports → dist`). Si recién clonaste el repo:

```bash
npm install
npm run build --workspace=@adelante/shared
npm run dev
```

El script raíz `npm run build` ejecuta los 3 workspaces en orden correcto (shared primero).

---

## Cómo extender el starter

Para agregar features que **toda app Adelante** debería usar:

1. Documentar la decisión en [`contexto_arquitectura.md`](./contexto_arquitectura.md) (qué se agrega, por qué, qué reemplaza).
2. Implementar en este repo (el starter).
3. Commit con prefijo `feat(starter): <descripción>` (convention de commits del grupo).
4. **Las apps existentes no se actualizan automáticamente.** Quien quiera adoptar el cambio lo portea manualmente.

Para reportar issues del starter: abrir un issue en este repo con el label `bug` o `enhancement`.

Para features específicas de una app individual (no transversales), implementarlas en el repo de esa app, no acá.

---

## Decisiones arquitectónicas

Todas las decisiones del stack, identidad visual, naming, deploy y patrones están en [`contexto_arquitectura.md`](./contexto_arquitectura.md). Es la fuente de verdad — este README es la guía operativa.

---

## Documentación adicional

- [`contexto_arquitectura.md`](./contexto_arquitectura.md) — decisiones técnicas completas, paleta corporativa, convenciones detalladas.
- [`INICIO_RAPIDO.md`](./INICIO_RAPIDO.md) — guía express de una página para arrancar una app nueva.
