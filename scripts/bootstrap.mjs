// scripts/bootstrap.mjs
// Setup inicial post-install: copia archivos de configuración locales y buildea shared.
// Se ejecuta automáticamente después de `npm install` vía el hook postinstall.
// Es idempotente — correr múltiples veces no rompe nada.

import { execSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

console.log('\n📦 Adelante starter — bootstrap post-install\n');

// 1. Copiar web/.env.example → web/.env.local si no existe
const webEnvExample = resolve(root, 'web/.env.example');
const webEnvLocal = resolve(root, 'web/.env.local');
if (!existsSync(webEnvLocal) && existsSync(webEnvExample)) {
  copyFileSync(webEnvExample, webEnvLocal);
  console.log('  ✓ Creado web/.env.local desde web/.env.example');
} else if (existsSync(webEnvLocal)) {
  console.log('  → web/.env.local ya existe, se respeta');
}

// 2. Copiar api/local.settings.example.json → api/local.settings.json si no existe
const apiSettingsExample = resolve(root, 'api/local.settings.example.json');
const apiSettingsLocal = resolve(root, 'api/local.settings.json');
if (!existsSync(apiSettingsLocal) && existsSync(apiSettingsExample)) {
  copyFileSync(apiSettingsExample, apiSettingsLocal);
  console.log('  ✓ Creado api/local.settings.json desde api/local.settings.example.json');
} else if (existsSync(apiSettingsLocal)) {
  console.log('  → api/local.settings.json ya existe, se respeta');
}

// 3. Buildear @adelante/shared para que tipos/utilidades estén disponibles
const sharedDist = resolve(root, 'shared/dist');
if (!existsSync(sharedDist)) {
  console.log('  ⚙ Buildeando @adelante/shared...');
  execSync('npm run build --workspace=@adelante/shared', {
    cwd: root,
    stdio: 'inherit',
  });
  console.log('  ✓ @adelante/shared buildeado');
} else {
  console.log('  → shared/dist ya existe, se respeta');
}

console.log('\n✅ Bootstrap completo. Ejecutá `npm run dev` para arrancar.\n');
