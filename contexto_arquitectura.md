# Contexto Arquitectónico — Apps Internas Grupo Adelante (v2)

> **Propósito:** Este documento es la fuente de verdad sobre las decisiones técnicas, convenciones y estructura estándar para todas las aplicaciones internas del Grupo Adelante. Toda nueva sesión de desarrollo (incluyendo Claude Code) debe leer este documento primero antes de tomar decisiones de arquitectura, stack o naming.
>
> **Versión:** 2.0 — incorpora decisiones tomadas durante la construcción del starter oficial.
> **Última actualización:** Mayo 2026
> **Mantenido por:** Luisro Navarro
> **Repo de referencia:** [`adelante-app-starter`](https://github.com/LRNAVARRO83/adelante-app-starter) (template oficial)

---

## 1. Contexto organizacional

**Grupo Adelante** (adelante.cr) es un grupo empresarial costarricense del rubro de desarrollo inmobiliario y construcción, parte del Navarro family business group. Las entidades operativas incluyen Adelante Desarrollos S.A. y subsidiarias relacionadas.

Las aplicaciones documentadas en este archivo son **herramientas internas** de uso corporativo (no productos comerciales). Sus usuarios son colaboradores del grupo, no clientes externos.

---

## 2. Aplicaciones existentes y referencia canónica

| App | Repo GitHub | Stack | Estado |
|---|---|---|---|
| **adelante-app-starter** | `adelante-app-starter` | Template oficial v2 | **Plantilla canónica** |
| Flujo de Desembolsos | `adelante-flujo-desembolsos` | Monorepo TS moderno (pre-starter) | En desarrollo, migrar a v2 cuando convenga |
| Aprobaciones de Compra | `aprobaciones-compra-pwa` | CRA + JS + MSAL | Legacy, mantenimiento |
| Pagos Socios Quinta Flor | `socios-app-v2` | CRA + JS | Legacy, mantenimiento |
| ObrasControl (admin) | `obrascontrol-admin` | HTML + JS + Supabase | Legacy, en producción |
| ObrasControl (campo) | `obrascontrol-campo` | PWA HTML + JS + Supabase | Legacy, en producción |

**Importante:** El stack oficial es el del template `adelante-app-starter`. Toda app nueva debe crearse haciendo "Use this template" desde GitHub. Las apps legacy se mantienen como están hasta que requieran cambio mayor; al hacerlo, se migran al stack oficial.

---

## 3. Stack tecnológico oficial

### 3.1 Estructura de proyecto: Monorepo con npm workspaces

Toda app nueva sigue este layout (replicado en el starter):

```
adelante-{nombre-app}/
├── package.json              # Workspace root
├── package-lock.json
├── tsconfig.base.json
├── biome.json                # Lint + format config
├── .editorconfig
├── .nvmrc                    # Node 20
├── .gitignore                # node_modules, dist, .env.local, local.settings.json, .claude/
├── .env.example
├── README.md
├── INICIO_RAPIDO.md
├── contexto_arquitectura.md  # Este documento (copia o symlink)
├── .github/
│   └── workflows/            # CI/CD: ci.yml, deploy-web.yml, deploy-api.yml
├── shared/                   # Tipos y utilidades compartidos
│   ├── package.json          # @adelante/shared
│   ├── src/
│   │   ├── tipos/
│   │   ├── schemas/          # Validación Zod compartida
│   │   ├── utilidades/
│   │   └── index.ts          # Barrel
│   └── tsconfig.json
├── api/                      # Backend: Azure Functions
│   ├── package.json          # @adelante/api
│   ├── src/
│   │   ├── auth/
│   │   │   └── middleware.ts # Validación JWT con jose + modo dev
│   │   ├── db/
│   │   │   └── pool.ts       # mssql pool con Managed Identity
│   │   ├── functions/        # Una function por archivo
│   │   ├── lib/
│   │   │   └── respuesta.ts  # Helpers: ok, error, noEncontrado, malRequest, etc.
│   │   └── index.ts
│   ├── host.json
│   ├── local.settings.example.json
│   ├── .funcignore           # Excluye src/, *.ts, tsconfig.json del deploy
│   └── tsconfig.json
└── web/                      # Frontend: Vite + React
    ├── package.json          # @adelante/web
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui (no editar manualmente)
    │   │   ├── dominio/      # MontoCRC, MontoUSD, FechaCR, EstadoBadge
    │   │   └── layout/       # HeaderAdelante, LayoutPrincipal, LogoAdelante
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── auth.ts       # MSAL config + modo dev
    │   │   ├── cliente.ts    # Cliente API tipado
    │   │   └── utils.ts      # cn() de shadcn
    │   ├── pages/            # Pantallas (PascalCase + Pantalla.tsx)
    │   ├── router/
    │   │   └── routes.tsx    # createBrowserRouter con future flags v7
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── index.css
    │   └── vite-env.d.ts     # Tipos de import.meta.env
    ├── index.html            # Carga Google Fonts (Roboto)
    ├── components.json       # shadcn config
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── vite.config.ts        # Alias @, proxy /api → 7071
    └── tsconfig.json
```

### 3.2 Versiones específicas (lockstep)

**Runtime:**
- Node.js: `>=20.0.0`
- npm: `>=10.0.0`

**Frontend (`web/`):**
- React: `^18.3.1`
- TypeScript: `^5.7.0`
- Vite: `^5.4.10`
- Tailwind CSS: `^3.4.14`
- shadcn/ui (vía CLI, código copiado al repo — style "new-york", base color "zinc")
- @tanstack/react-query: `^5.59.0`
- @azure/msal-browser: `^5.10.0`
- @azure/msal-react: `^5.4.0`
- react-router-dom: `^6.28.0` (con future flags v7 activos)
- sonner: `^1.7.0` (toasts — NO el componente Toast viejo de Radix)
- lucide-react: `^0.456.0` (íconos)

**UI peer dependencies (instaladas automáticamente para shadcn):**
- @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-select, @radix-ui/react-slot
- class-variance-authority (cva)
- clsx, tailwind-merge
- tailwindcss-animate (preset de animaciones para Radix)

**Backend (`api/`):**
- @azure/functions: `^4.5.0` (programming model v4 con `EnableWorkerIndexing`)
- @azure/identity: `^4.5.0` (Managed Identity para Azure SQL)
- mssql: `^11.0.1` (driver Azure SQL)
- zod: `^3.23.8` (validación)
- jose: `^6.2.3` (validación de JWT de Entra ID)

**Compartido (`shared/`):**
- TypeScript publicado como librería interna (`main`: `./dist/index.js`, `types`: `./dist/index.d.ts`)
- Único dependency runtime: **Zod** (excepción justificada por necesidad de schemas compartidos)
- ESM nativo (`type: "module"`) con `exports` por subpath

**Tooling raíz:**
- @biomejs/biome: `^1.9.4` (linter + formatter, reemplaza ESLint + Prettier)
- concurrently: `^9.1.0` (orquestación de scripts paralelos)
- rimraf: `^6.0.0` (limpieza portable Windows/Mac/Linux)

### 3.3 Por qué este stack

- **Monorepo workspaces:** tipos compartidos entre frontend y backend evitan inconsistencias al cambiar contratos de API.
- **TypeScript end-to-end:** detección temprana de bugs, especialmente en manejo de montos, monedas, fechas y IDs.
- **Vite (no CRA):** CRA está prácticamente deprecado desde 2023. Vite es estándar moderno.
- **Azure Functions v4 programming model:** registro programático con `app.http(...)`, sin `function.json`. Requiere flag `AzureWebJobsFeatureFlags: "EnableWorkerIndexing"`.
- **shadcn/ui:** componentes accesibles (Radix UI por debajo), código en el repo, personalizables. Style "new-york".
- **Sonner para toasts:** reemplaza el patrón viejo `toast.tsx + toaster.tsx + use-toast.ts` con un solo archivo `sonner.tsx`. Configurado a `theme="light"` hardcoded (no `next-themes`).
- **React Router con future flags v7:** preparado para migración futura sin warnings.
- **Zod en backend y shared:** valida cada request, los tipos derivan automáticamente.
- **MSAL:** estándar Microsoft para Azure AD/Entra ID, integración con M365.
- **Biome en vez de ESLint + Prettier:** una sola dependencia, ultra rápido (Rust), reemplaza ambos.

---

## 4. Identidad visual Adelante

### 4.1 Paleta corporativa

```typescript
// tailwind.config.ts
colors: {
  adelante: {
    primary: '#ADD010',        // Verde Adelante (acento principal)
    'primary-dark': '#7A9A0B', // Verde sombra (hover, depth)
    foreground: '#0A0A0A',     // Negro casi puro (texto principal)
    background: '#FFFFFF',     // Blanco (fondo principal)
    'bg-secondary': '#FAFAFA', // Gris muy claro (cards, áreas secundarias)
    border: '#E4E4E7',         // Borde sutil
    muted: '#71717A',          // Texto secundario / muted
  }
}
```

**Variables semánticas de shadcn/ui** mapeadas en `web/src/index.css` bloque `:root`:

Las variables CSS están en formato **HSL space-separated** (`H S% L%`, sin `hsl()` wrapper) porque los componentes shadcn las consumen como `hsl(var(--primary))`:

```css
:root {
  --background: 0 0% 100%;        /* #FFFFFF */
  --foreground: 0 0% 4%;          /* #0A0A0A */
  --primary: 73 86% 44%;          /* #ADD010 */
  --primary-foreground: 0 0% 4%;  /* #0A0A0A */
  --secondary: 0 0% 98%;          /* #FAFAFA */
  --muted: 0 0% 98%;
  --muted-foreground: 240 4% 46%; /* #71717A */
  --accent: 0 0% 96%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 6% 90%;           /* #E4E4E7 */
  --input: 240 6% 90%;
  --ring: 73 86% 44%;
  --radius: 0.5rem;
}
```

**Sin bloque `.dark` ni `@media (prefers-color-scheme: dark)`.** El starter es light-only por decisión explícita.

### 4.2 Tema visual

**Light theme** para toda área de trabajo. Decisión deliberada:
- Apps usadas durante jornadas largas en oficina con luz natural.
- Dashboards corporativos serios convencionalmente son light.
- Evita reflejo en pantallas y fatiga visual.

**Header de navegación oscuro** (`bg-[#0A0A0A]`) con logo Adelante en verde — replica brand guide en zona de marca, sin agredir al usuario en el área principal de trabajo.

**Verde `#ADD010` como acento puntual**, nunca como fondo masivo:
- Botones primarios
- Bordes destacados de KPIs
- Badges de estado positivo (Procesado, OK)
- Links y CTAs
- Avatar del usuario en header

**Dark mode:** NO implementado. `next-themes` NO instalado deliberadamente para reducir deps.

### 4.3 Tipografía

**Roboto** según brand guide oficial Adelante:

```typescript
fontFamily: {
  sans: ['Roboto', 'system-ui', 'sans-serif'],
  mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
  serif: ['Roboto Serif', 'serif'],
}
```

Pesos a usar:
- `font-normal` (400): texto general
- `font-medium` (500): énfasis ligero, headers de tabla
- `font-semibold` (600): títulos de sección
- `font-bold` (700): títulos de página, branding

Carga vía Google Fonts en `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Uso por contexto:**
- `font-sans` (Roboto): UI general, párrafos, títulos, formularios
- `font-mono` (Roboto Mono): claves de Hacienda, IDs, códigos CABYS, datos técnicos
- `font-serif` (Roboto Serif): solo documentos formales generados

---

## 5. Convenciones de naming

Idioma: **español para dominio de negocio, inglés para palabras reservadas de framework**.

### 5.1 Archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componente React (pantalla) | PascalCase + sufijo `Pantalla.tsx` | `DashboardPantalla.tsx`, `EjemploPantalla.tsx` |
| Componente React (panel) | PascalCase + sufijo `Panel.tsx` | `PanelProveedor.tsx` |
| Componente React (modal) | PascalCase + prefijo `Modal` | `ModalNuevoMovimiento.tsx` |
| Componente UI genérico | PascalCase descriptivo | `MontoCRC.tsx`, `EstadoBadge.tsx` |
| Hook personalizado | camelCase con prefijo `use` | `useFacturas.ts`, `useEjemplo.ts` |
| Function de Azure | camelCase, sustantivo plural | `facturas.ts`, `ejemplo.ts` |
| Utilidad / lib | camelCase descriptivo | `formatearMonto.ts` |
| Componente shadcn/ui | kebab-case (no editar manualmente) | `button.tsx`, `dialog.tsx`, `sonner.tsx` |

### 5.2 Identificadores en código

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tipos TypeScript | PascalCase en español | `Factura`, `LineaFactura`, `EstadoFactura` |
| Variables / parámetros | camelCase en español | `facturaActual`, `montoTotal` |
| Funciones | camelCase en español, verbo | `calcularTotal()`, `procesarFactura()` |
| Constantes globales | UPPER_SNAKE_CASE en español | `MONEDA_DEFAULT`, `TASA_IVA` |
| Componentes React | PascalCase en español | `<DashboardPantalla />`, `<MontoCRC />` |
| Hooks (export) | camelCase en inglés | `useFacturas`, `useMutation` |
| Tipos genéricos | T/K/V (inglés convencional) | `Promise<T>`, `Record<K, V>` |
| Eventos React | Inglés convencional | `onClick`, `onChange`, `onSubmit` |

### 5.3 Endpoints API

Rutas REST en español, kebab-case, plural:

```
GET    /api/facturas
GET    /api/facturas/{clave}
POST   /api/facturas
GET    /api/facturas/dashboard/resumen?fecha=2026-05-12
GET    /api/facturas/dashboard/por-proveedor?desde=&hasta=
```

### 5.4 Base de datos (Azure SQL)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tablas | snake_case en español, plural | `facturas`, `factura_lineas` |
| Columnas | snake_case en español | `fecha_emision`, `monto_total` |
| Foreign keys | `id_<tabla_singular>` | `id_factura`, `id_proveedor` |
| Índices | `idx_<tabla>_<columnas>` | `idx_facturas_fecha_emision` |
| Stored procedures | `sp_<accion>_<entidad>` | `sp_insertar_factura` |

### 5.5 Commits

**Convención: Conventional Commits**

```
<tipo>: <descripción breve>

[cuerpo opcional]
```

Tipos:
- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `chore:` — tareas de mantenimiento, scaffolding, infra
- `docs:` — solo documentación
- `refactor:` — reorganización sin cambios funcionales
- `test:` — agregar o modificar tests
- `style:` — formato, sin cambios funcionales

---

## 6. Patrones arquitectónicos clave

### 6.1 Autenticación: Azure AD (Entra ID) con MSAL

**Frontend:** `@azure/msal-react` envuelve la app, redirige a Microsoft login si no hay sesión.

**Backend:** Middleware en `api/src/auth/middleware.ts` valida el JWT (con `jose`) en cada request. Extrae claims (oid, email, name) y los inyecta en el contexto.

**Tenant Adelante:** `27272476-d569-411c-ab78-6d3f3b7596e5`

**Patrón de dos App Registrations por app:**
- **App Registration "API"**: expone scope custom `api://{client-id}/access`. Sin redirect URI. Tipo Web API.
- **App Registration "Web"**: SPA con redirect URIs. Tiene permiso delegado al scope del API. Admin consent pre-otorgado.

Razón: separación de identidades públicas (frontend) y privadas (API).

**Modo dev del middleware (frontend y backend):**
Doble blindaje de seguridad:
- Backend: activo solo si `NODE_ENV !== 'production'` AND `AUTH_DEV_MODE === 'true'`
- Frontend: activo solo si `import.meta.env.DEV === true` AND `VITE_AUTH_DEV_MODE === 'true'`

Usuario hardcoded en modo dev: `{ oid: 'dev-user', email: 'dev@adelante.cr', nombre: 'Dev User', roles: ['Dev'] }`.

Permite desarrollar sin Azure real configurado. **Nunca activar en producción.**

### 6.2 Conexión a Azure SQL: Managed Identity

**Nunca usar usuario/password en código o variables de entorno.**

Usar `@azure/identity` con `DefaultAzureCredential`. En local usa Azure CLI (`az login`); en producción usa Managed Identity del Function App. El pool de conexiones vive en `api/src/db/pool.ts` (patrón singleton).

Servidor SQL del grupo: `mysqladelante.database.windows.net` (suscripción `c9eb72ac-56f5-4a8a-bf31-f8f00b18f314` — azureadelantedesarrollos).

### 6.3 Validación: Zod en cada request

Cada Function valida su request body/params con un schema Zod. Los tipos TypeScript se derivan automáticamente:

```typescript
import { z } from 'zod';

const NuevaFacturaSchema = z.object({
  clave: z.string().length(50),
  fecha_emision: z.string().datetime(),
  monto_total: z.number().positive(),
});

type NuevaFactura = z.infer<typeof NuevaFacturaSchema>;
```

Schemas reutilizables viven en `shared/src/schemas/` y se consumen tanto desde `api/` como desde `web/`.

### 6.4 Data fetching: TanStack Query

Toda llamada API desde el frontend usa `useQuery` o `useMutation`. Nunca `useEffect` + `fetch` directo.

Configuración global en `main.tsx`:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})
```

Convención: hooks de query en `web/src/hooks/`, una función por endpoint.

### 6.5 Cliente API tipado

`web/src/lib/cliente.ts` exporta un objeto `cliente` con todos los endpoints como funciones tipadas. Importa tipos de `@adelante/shared` para garantizar consistencia con el backend.

Funciones helper:
- `obtenerToken()` — extrae JWT de MSAL (o null en modo dev)
- `pedir<T>(ruta, opciones)` — wrapper genérico de fetch con auth header
- `obtenerUsuarioActual()` — devuelve usuario del MSAL o dummy en modo dev

### 6.6 Routing: React Router v6 con future flags v7

`web/src/router/routes.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter(
  [...],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
)
```

En `App.tsx`, el `<RouterProvider>` recibe:
```typescript
<RouterProvider router={router} future={{ v7_startTransition: true }} />
```

(El flag `v7_startTransition` va en el provider, no en el router.)

Convención:
- Pantallas en `web/src/pages/` con sufijo `Pantalla.tsx`
- Rutas registradas centralmente en `web/src/router/routes.tsx`
- Página 404 obligatoria: `NoEncontradoPantalla.tsx`

### 6.7 Componentes de dominio Adelante

Componentes reutilizables específicos del negocio, viven en `web/src/components/dominio/`. Construidos **encima de los primitivos de shadcn/ui** (no los reemplazan, los personalizan con `className` override):

- `<MontoCRC monto={...} />` — formato `₡1,234,567.89` con `font-mono tabular-nums`
- `<MontoUSD monto={...} />` — formato `$1,234.56`
- `<FechaCR fecha={...} formato="corto" | "largo" | "iso" />` — formato es-CR
- `<EstadoBadge estado={...} />` — badge con color semántico por estado

**Formato monetario oficial Adelante:** `₡2,695,500.50` (coma como separador de miles, punto como decimal). Implementado con locale `en-US` + símbolo manual, no `es-CR` que mete espacios. Razón: consistencia con sistemas de negocio CR (Business Central, Hacienda, bancos).

Todos en `formatearMonto.ts` y `formatearFecha.ts` dentro de `shared/src/utilidades/`.

### 6.8 Layout

- `<LogoAdelante altura={...} />` — SVG inline del logo (4 paralelogramos verde lime + sombras)
- `<HeaderAdelante />` — barra superior negra, logo a la izquierda, navegación al centro, avatar a la derecha (iniciales del usuario)
- `<LayoutPrincipal />` — wrapper con HeaderAdelante + `<main>` con `<Outlet />` de react-router

Sin sidebar por default. Apps que lo requieran lo agregan.

### 6.9 Toasts: Sonner (NO el patrón viejo de Radix)

shadcn/ui deprecó el componente Toast clásico (`toast.tsx + toaster.tsx + use-toast.ts`) en 2024 y ahora recomienda Sonner.

**Uso:**
```typescript
import { toast } from 'sonner'

toast.success('Factura procesada', {
  description: 'La factura 506...01 fue guardada correctamente',
})
toast.error('Error al parsear XML')
toast.info('Logic App ejecutándose')
```

**Wrapper en `web/src/components/ui/sonner.tsx`:** configurado con `theme="light"` hardcoded (no `next-themes`). Si en el futuro se decide implementar dark mode, este wrapper es el punto único de cambio.

### 6.10 Helpers de respuesta API

`api/src/lib/respuesta.ts` provee helpers para construir respuestas HTTP estándar:

```typescript
export function ok<T>(data: T): RespuestaApi<T>
export function error(status: number, mensaje: string): RespuestaApi<never>
export function noEncontrado(mensaje?: string): RespuestaApi<never>      // 404
export function malRequest(mensaje: string): RespuestaApi<never>          // 400
export function noAutorizado(mensaje?: string): RespuestaApi<never>       // 401
export function errorInterno(mensaje?: string): RespuestaApi<never>       // 500
```

Todas devuelven `RespuestaApi<T>` (tipo discriminado de `@adelante/shared`):
```typescript
type RespuestaApi<T> = { data: T; error: null } | { data: null; error: ErrorApi }
```

Type guard: `esRespuestaExitosa(r)` para narrowing en TypeScript.

---

## 7. Deploy y operación

### 7.1 Hosting

- **Frontend:** Azure Static Web Apps (una por app)
- **Backend:** Azure Functions (Consumption Plan o Flex Consumption)
- **Base de datos:** Azure SQL en `mysqladelante` (preferentemente Serverless para apps de baja demanda)
- **Storage:** Azure Blob Storage cuando se requiera (XMLs, PDFs, archivos)

### 7.2 CI/CD: 3 workflows oficiales

Vivos en `.github/workflows/`:

**`ci.yml` — Validación en cada push y PR:**
- Trigger: push a cualquier branch + PR a main
- Steps: checkout → Node 20 cache → npm ci → build shared → typecheck → lint (Biome) → build api + web
- Concurrency: cancel runs anteriores en mismo ref (`cancel-in-progress: true`)
- Permissions mínimos: `contents: read`
- Timeout: 10 minutos

**`deploy-web.yml` — Deploy a Azure Static Web Apps:**
- Trigger: push a main + manual (`workflow_dispatch`)
- ⚠️ Build pre-runner con `skip_app_build: true` porque **Oryx (builder interno de SWA) NO entiende npm workspaces** y rompe al intentar resolver `@adelante/shared`. Patrón crítico.
- Concurrency: NO cancelar runs activos (`cancel-in-progress: false`)
- Secret requerido: `AZURE_STATIC_WEB_APPS_API_TOKEN`

**`deploy-api.yml` — Deploy a Azure Functions:**
- Trigger: push a main con paths `api/**`, `shared/**`, lockfile o el workflow
- ⚠️ **Patch crítico para monorepos**: materializar `shared/dist` como archivos físicos en `api/node_modules/@adelante/shared/` antes de zippear. El zip de functions-action NO preserva symlinks de workspaces, da `MODULE_NOT_FOUND` en runtime sin esto.
- `npm install --omit=dev --no-package-lock --workspaces=false` para tener `node_modules` standalone
- Deploy con `package: api` y `respect-funcignore: true`
- Variable (no secret): `AZURE_FUNCTIONAPP_NAME` (el nombre del Function App no es sensible)
- Secret: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`

### 7.3 Variables de entorno

**Frontend (`web/.env.local`, NO commitear):**
```
VITE_API_URL=http://localhost:7071
VITE_AZURE_CLIENT_ID=<web-client-id-de-app-registration-web>
VITE_AZURE_TENANT_ID=<tenant-adelante>
VITE_AZURE_API_SCOPE=api://<api-client-id>/access
VITE_AUTH_DEV_MODE=true  # solo dev, false en prod
```

**Backend (`api/local.settings.json`, NO commitear):**
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "NODE_ENV": "development",
    "AUTH_DEV_MODE": "true",
    "AZURE_TENANT_ID": "...",
    "AZURE_API_CLIENT_ID": "...",
    "AZURE_API_AUDIENCE": "api://..."
  }
}
```

Production usa Application Settings del Function App con Managed Identity.

### 7.4 Tabla de secrets/variables por workflow

| Workflow | Tipo | Nombre | Fuente |
|---|---|---|---|
| `deploy-web.yml` | secret | `AZURE_STATIC_WEB_APPS_API_TOKEN` | Portal Azure → SWA → Manage deployment token |
| `deploy-api.yml` | variable | `AZURE_FUNCTIONAPP_NAME` | Nombre del Function App creado |
| `deploy-api.yml` | secret | `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Portal Azure → Function App → Get publish profile (XML completo) |

---

## 8. Workflow de desarrollo

### 8.1 Levantar app local

```bash
git clone <repo>
cd <repo>
npm install
npm run dev    # Levanta api y web en paralelo con concurrently
```

Puertos por convención:
- `web` (Vite): `5173`
- `api` (Functions): `7071`

### 8.2 Comandos estándar

| Comando | Acción |
|---|---|
| `npm run dev` | Dev mode (api + web concurrente) |
| `npm run build` | Build de todos los workspaces |
| `npm run typecheck` | Verifica tipos en todos los workspaces |
| `npm run lint` | Biome check (lint + format check) |
| `npm run format` | Biome format --write |
| `npm run check` | Biome check --write (lint + format en uno) |
| `npm run clean` | Limpia builds y node_modules (con rimraf, portable) |

### 8.3 Branches

- `main`: producción
- `develop`: integración (si aplica)
- `feature/<nombre>`: desarrollo de feature
- `fix/<nombre>`: correcciones

### 8.4 Crear app nueva desde el starter

1. En GitHub, click **"Use this template"** en `adelante-app-starter`
2. Nombre: `adelante-<nombre-app>` (kebab-case)
3. Clonar localmente
4. `npm install && npm run dev`
5. Modificar identidad: `package.json` workspaces, `README.md`, etc.
6. Eliminar pantalla y endpoint de ejemplo cuando ya no se necesiten
7. Empezar a desarrollar lógica de negocio

---

## 9. Starter oficial: `adelante-app-starter`

Repo template en GitHub (`https://github.com/LRNAVARRO83/adelante-app-starter`) marcado como "Template repository". Materializa todo este documento.

**Filosofía del starter:**
- Es un molde, no una aplicación. Sin lógica de negocio específica.
- Incluye un ejemplo end-to-end mínimo (1 endpoint + 1 pantalla + 1 hook) que sirve de patrón canónico replicable.
- Componentes shadcn esenciales pre-instalados.
- Componentes de dominio Adelante listos.
- Layout base con header oscuro y logo.
- Auth MSAL configurada con modo dev para arrancar sin Azure real.
- GitHub Actions de CI/CD pre-cableadas.
- README + INICIO_RAPIDO documentación lista.

**Componentes shadcn instalados por default:** button, label, input, card, badge, select, table, dialog, sonner.

**Componentes shadcn NO instalados (cada app los agrega si los necesita):** calendar, popover, command, form, checkbox, radio, switch, tabs, tooltip, etc.

**Para agregar componentes shadcn nuevos:**
```bash
npx shadcn@latest add <componente>
```
Es código que se copia al repo, queda tuyo, podés modificarlo.

**Nota: `components/ui/**` está en el ignore de Biome.** Esos archivos vienen de shadcn y se actualizan vía CLI, no se reformatean con reglas propias.

---

## 10. Decisiones tomadas y NO revisables sin discusión

Estas decisiones son intencionales y no deben cambiarse en una app individual sin actualizar este documento primero:

1. ✅ Monorepo workspaces (no repos separados para api/web)
2. ✅ TypeScript en todo el stack (no JavaScript)
3. ✅ Vite (no Create React App, no Next.js para apps internas)
4. ✅ shadcn/ui style "new-york" (no Material UI, no Ant Design, no librerías propias desde cero)
5. ✅ Tailwind CSS (no CSS modules, no styled-components)
6. ✅ TanStack Query (no SWR, no fetch directo con useEffect)
7. ✅ Azure Functions v4 programming model con `EnableWorkerIndexing`
8. ✅ mssql + Managed Identity (no Entity Framework, no Prisma)
9. ✅ Zod para validación (no Yup, no Joi)
10. ✅ MSAL para auth (no Auth0, no custom JWT)
11. ✅ Light theme con acento verde Adelante (no dark theme por default)
12. ✅ Roboto como tipografía oficial (consistente con brand guide)
13. ✅ Naming en español para dominio (no inglés forzado)
14. ✅ **Biome** como linter + formatter (no ESLint, no Prettier)
15. ✅ **Sonner** para toasts (no el patrón Toast viejo de Radix)
16. ✅ **React Router v6 con future flags v7** activos
17. ✅ **Conventional Commits** para mensajes de commit
18. ✅ **Format monetario `₡2,695,500.50`** (locale `en-US` con símbolo manual)
19. ✅ **`next-themes` NO instalado** (light-only deliberado)
20. ✅ **Dos App Registrations por app** (API + Web separadas)
21. ✅ **ESM + NodeNext** en `api/` para coherencia con `shared/` ESM
22. ✅ **`.funcignore` agresivo** (excluir `src/`, `*.ts`, `tsconfig.json` del deploy)
23. ✅ **Doble blindaje del modo dev** (`NODE_ENV` + flag explícito)
24. ✅ **Variables CSS en formato HSL space-separated** (sin `hsl()` wrapper)

---

## 11. Patrones de troubleshooting (issues conocidos y soluciones)

### Vulnerabilidad esbuild en dev server
- Versión `<=0.24.2` (transitiva via Vite 5) tiene CVE moderate
- Solo afecta `vite dev`, no builds de producción
- Riesgo real cero en uso normal (red corporativa, no exposición pública)
- **Sin acción requerida.** Actualizar Vite a 8 rompe el lockstep.

### AzureWebJobsStorage warning en dev local
- `func start` muestra warning de "storage unhealthy" si no está configurado
- No bloquea HTTP, solo deshabilita features como triggers de queue/blob
- **Sin acción en local.** En producción, Function App ya viene con storage configurado.

### Errores `<other>` en DevTools Console
- Provienen de extensiones del navegador (DELANT, Adobe, Copilot, etc.), no del código
- Indicador en Edge: "No Issues" + "X hidden"
- **Ignorar.** Para validar, probar en modo InPrivate sin extensiones.

### Puerto 7071 ocupado al arrancar `func start`
- Otra app de Adelante corriendo en paralelo
- Solución 1: cerrar la otra terminal
- Solución 2: `taskkill /F /PID <pid>` después de identificar con `Get-NetTCPConnection -LocalPort 7071`
- NO cambiar el puerto canónico del starter (ensucia config)

### Personal Access Token sin scope `workflow`
- Error al pushear `.github/workflows/*.yml`: "refusing to allow a Personal Access Token to create or update workflow without `workflow` scope"
- Solución: generar nuevo PAT en `https://github.com/settings/tokens` con scopes `repo` + `workflow` + `write:packages`
- Si Git Credential Manager reusa el PAT viejo silenciosamente, incrustar el PAT en la URL del remote: `git remote set-url origin https://<usuario>:<pat>@github.com/...`
- Después limpiar URL: `git remote set-url origin https://github.com/<owner>/<repo>.git`

### Git autocrlf warnings (LF → CRLF) en Windows
- Aparece al hacer `git add -A` en archivos creados con LF
- Es comportamiento esperado de `core.autocrlf=true` (default Git for Windows)
- **Sin acción.** Git convierte automáticamente, archivos en GitHub quedan en LF.

### rimraf con globs en Windows
- `rm -rf` no es portable en cmd/PowerShell
- Usar `rimraf` con paths explícitos (no glob `**/node_modules`)

### `@adelante/shared` no encontrado en deploy de Functions
- Symlinks de workspaces no se preservan al zippear
- Solución en `deploy-api.yml`: copiar físicamente `shared/dist` → `api/node_modules/@adelante/shared/` antes del deploy

### SWA falla al detectar workspaces
- Oryx (builder interno de Azure Static Web Apps) no entiende npm workspaces
- Solución en `deploy-web.yml`: pre-build en el runner, `skip_app_build: true` en la action

### Bootstrap automático post-install
El script `scripts/bootstrap.mjs` se ejecuta vía `postinstall` y resuelve 3 setups que antes eran manuales:
- Copia `web/.env.example` → `web/.env.local`
- Copia `api/local.settings.example.json` → `api/local.settings.json`
- Buildea `@adelante/shared` para resolver imports

Es idempotente — si los archivos ya existen, se respetan. Detectado durante validación end-to-end del template (FASE 4 de la sesión inicial del starter).

### `@adelante/shared` no resuelve después de clone fresh
- Causa: `shared/dist/` gitignored y nunca buildado
- Fix: bootstrap automático lo hace en postinstall
- Fix manual (si falla bootstrap): `npm run build --workspace=@adelante/shared`

### `func start` queda colgado pidiendo elegir worker runtime
- Causa: `api/local.settings.json` no existe, no encuentra `FUNCTIONS_WORKER_RUNTIME`
- Fix: bootstrap automático copia el archivo desde el `.example`
- Fix manual (si falla bootstrap): `Copy-Item api/local.settings.example.json api/local.settings.json`

---

## 12. Próximas decisiones pendientes

A medida que las apps crezcan, decisiones a evaluar:

- **Testing:** Vitest para frontend y backend, qué cobertura mínima
- **E2E:** ¿Playwright? ¿Cuándo justifica el costo de mantenimiento?
- **Observabilidad:** Application Insights, structured logging
- **Feature flags:** ¿librería o variables de entorno?
- **i18n:** por ahora todo en español; si llega cliente externo, evaluar
- **Estado global:** Zustand vs Context API según complejidad por app
- **Migrar apps legacy al stack v2:** ObrasControl, Aprobaciones, Socios Quinta Flor cuando requieran cambio mayor
- **Pre-autorizar la app Web como cliente del API en Entra ID:** mejora UX al primer login (evita pantalla de consentimiento extra)
- **OIDC para deploys** (en vez de publish profiles): Federated Credentials de Entra ID. El permiso `id-token: write` ya está reservado en los workflows.
- **Refactor menor:** mover `obtenerUsuarioActual` de `cliente.ts` a `auth.ts` (conceptualmente pertenece ahí).

---

## 13. Cómo usar este documento

**Para Claude Code:** Este archivo debe estar en el Project de Claude de Adelante. Toda nueva sesión de desarrollo de apps Adelante comienza referenciándolo: *"Lee `contexto_arquitectura.md` antes de cualquier decisión técnica."*

**Para developers humanos:** Lectura obligatoria al onboarding. Consultar antes de proponer cambios de stack.

**Para mantenimiento:** Este documento se actualiza cuando se toma una decisión arquitectónica nueva o se cambia una existente. El commit que actualiza este documento debe seguir Conventional Commits: `docs(arch): <descripción del cambio>`. El razonamiento del cambio va en el cuerpo del commit.

---

## 14. Historial de versiones

- **v2.0** (Mayo 2026) — Incorpora todas las decisiones tomadas durante la construcción del starter oficial: Biome, Sonner, React Router future flags, formato monetario, patrones de deploy con workarounds críticos (Oryx + Functions symlinks), doble blindaje de modo dev, formato HSL space-separated, troubleshooting consolidado de issues reales, dos App Registrations por app.
- **v1.0** (Mayo 2026) — Versión inicial con decisiones base de stack y arquitectura.
